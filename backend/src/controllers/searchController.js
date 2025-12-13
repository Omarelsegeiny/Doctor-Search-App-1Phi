const {
  parseQuery,
  hasMeaningfulInfo,
  isLikelyGibberish,
} = require("../utils/queryParser");
const {
  getFallbackProviders,
  searchProviders,
} = require("../services/providerService");

const searchDoctors = async (req, res) => {
  const { query, limit = 12 } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Query is required" });
  }

  // Validate and sanitize limit parameter
  const sanitizedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
  if (isNaN(sanitizedLimit) || sanitizedLimit < 1) {
    return res.status(400).json({ error: "Limit must be a positive number" });
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
        const fallbackRows = await getFallbackProviders(fallbackSpecialties);
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

    // Build search filters from parsed query
    const filters = {
      specialty: parsed.specialty,
      city: parsed.location.city,
      state: parsed.location.state,
    };

    // Search providers using the service layer
    const rows = await searchProviders(filters, sanitizedLimit);

    // Limit final results
    const results = rows.slice(0, sanitizedLimit);

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
};

module.exports = {
  searchDoctors,
};
