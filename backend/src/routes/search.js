const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { query, location, limit = 10 } = req.body;

  let specialty = null;
  if (query.toLowerCase().includes("cardiologist")) {
    specialty = "Cardiology";
  }

  try {
    let sql = `
      SELECT
        rndrng_npi AS npi,
        rndrng_prvdr_first_name AS first_name,
        rndrng_prvdr_last_org_name AS last_name,
        rndrng_prvdr_type AS specialty,
        rndrng_prvdr_city AS city,
        rndrng_prvdr_state_abrvtn AS state,
        rndrng_prvdr_zip5 AS zip
      FROM providers
    `;

    const params = [];

    if (specialty) {
      sql += " WHERE rndrng_prvdr_type = ?";
      params.push(specialty);
    }

    sql += " LIMIT 200"; // pre-filter

    let [rows] = await pool.query(sql, params);

    if (location && location.city) {
      rows = rows.filter(
        (r) =>
          r.city && r.city.toLowerCase().includes(location.city.toLowerCase())
      );
    }

    const results = rows.slice(0, limit);

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
