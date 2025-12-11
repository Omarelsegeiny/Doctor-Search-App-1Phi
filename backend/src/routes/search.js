const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
  parseQuery,
  hasMeaningfulInfo,
  isLikelyGibberish,
} = require("../utils/queryParser");

router.post("/", async (req, res) => {
  const { query, limit = 12 } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // Parse the natural language query
    const parsed = parseQuery(query.trim());
    console.log("Parsed query:", parsed);

    // Check if query is gibberish or has no meaningful information
    const isGibberish = isLikelyGibberish(query.trim());
    const hasInfo = hasMeaningfulInfo(parsed);

    if (isGibberish || !hasInfo) {
      // Get fallback results (popular specialties)
      const fallbackSpecialties = [
        "Cardiology",
        "Dermatology",
        "Pediatrics",
        "Orthopedic Surgery",
        "Ophthalmology",
      ];

      // Get some fallback providers from popular specialties
      let fallbackResults = [];
      try {
        // Get a few providers from each popular specialty
        const fallbackSql = `
          SELECT DISTINCT
            rndrng_npi AS npi,
            rndrng_prvdr_first_name AS first_name,
            rndrng_prvdr_last_org_name AS last_name,
            rndrng_prvdr_type AS specialty,
            rndrng_prvdr_city AS city,
            rndrng_prvdr_state_abrvtn AS state,
            rndrng_prvdr_zip5 AS zip
          FROM providers
          WHERE rndrng_prvdr_type IN (?, ?, ?, ?, ?)
          ORDER BY rndrng_npi
          LIMIT 6
        `;
        const [fallbackRows] = await pool.query(
          fallbackSql,
          fallbackSpecialties
        );
        // Shuffle the results in JavaScript for better randomness
        fallbackResults = fallbackRows.sort(() => Math.random() - 0.5);
      } catch (fallbackErr) {
        console.error("Error fetching fallback results:", fallbackErr);
      }

      return res.json({
        results: fallbackResults,
        message:
          "We couldn't find any doctors matching your input. Try a specialty (like cardiology) or city.",
        isFallback: true,
        parsed: {
          specialty: parsed.specialty,
          location: parsed.location,
          procedures: parsed.procedures,
        },
      });
    }

    // Build SQL query with WHERE conditions
    let sql = `
      SELECT DISTINCT
        rndrng_npi AS npi,
        rndrng_prvdr_first_name AS first_name,
        rndrng_prvdr_last_org_name AS last_name,
        rndrng_prvdr_type AS specialty,
        rndrng_prvdr_city AS city,
        rndrng_prvdr_state_abrvtn AS state,
        rndrng_prvdr_zip5 AS zip
      FROM providers
    `;

    const conditions = [];
    const params = [];

    // Filter by specialty if found
    if (parsed.specialty) {
      conditions.push("rndrng_prvdr_type = ?");
      params.push(parsed.specialty);
    }

    // Filter by city if found
    if (parsed.location.city) {
      conditions.push("LOWER(rndrng_prvdr_city) LIKE ?");
      params.push(`%${parsed.location.city.toLowerCase()}%`);
    }

    // Filter by state if found
    if (parsed.location.state) {
      conditions.push("rndrng_prvdr_state_abrvtn = ?");
      params.push(parsed.location.state);
    }

    // Add WHERE clause if we have conditions
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    // Order by relevance (prefer exact matches, then limit)
    sql += " ORDER BY rndrng_prvdr_type, rndrng_prvdr_city";
    sql += ` LIMIT ${Math.min(limit * 3, 500)}`; // Get more results for filtering

    let [rows] = await pool.query(sql, params);

    // Limit final results
    const results = rows.slice(0, limit);

    // If no results found for a valid query, provide a helpful message
    if (results.length === 0) {
      return res.json({
        results: [],
        message: `No doctors found matching your criteria. Try adjusting your search - maybe try a different city or a broader specialty.`,
        isFallback: false,
        parsed: {
          specialty: parsed.specialty,
          location: parsed.location,
          procedures: parsed.procedures,
        },
      });
    }

    res.json({
      results,
      parsed: {
        specialty: parsed.specialty,
        location: parsed.location,
        procedures: parsed.procedures,
      },
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
