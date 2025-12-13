const pool = require("../db");

/**
 * Get fallback providers from popular specialties
 * @param {string[]} specialties - Array of specialty names
 * @returns {Promise<Array>} Array of provider objects
 */
const getFallbackProviders = async (specialties) => {
  // Validate specialties array
  if (!Array.isArray(specialties) || specialties.length === 0) {
    throw new Error("Specialties must be a non-empty array");
  }

  // Validate all specialties are strings
  const validSpecialties = specialties.filter(
    (s) => typeof s === "string" && s.trim().length > 0
  );

  if (validSpecialties.length === 0) {
    throw new Error("All specialties must be non-empty strings");
  }

  // Build parameterized IN clause dynamically
  const placeholders = validSpecialties.map(() => "?").join(", ");
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
    WHERE rndrng_prvdr_type IN (${placeholders})
    ORDER BY rndrng_npi
    LIMIT ?
  `;

  // Parameterize the LIMIT value
  const params = [...validSpecialties, 6];
  const [rows] = await pool.query(fallbackSql, params);
  return rows;
};

/**
 * Search providers by filters
 * @param {Object} filters - Search filters
 * @param {string} filters.specialty - Provider specialty
 * @param {string} filters.city - City name
 * @param {string} filters.state - State abbreviation
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} Array of provider objects
 */
const searchProviders = async (filters, limit) => {
  // Validate and sanitize limit to prevent SQL injection
  const sanitizedLimit = Math.max(1, Math.min(500, parseInt(limit, 10) || 12));
  const queryLimit = Math.min(sanitizedLimit * 3, 500);

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

  // Filter by specialty if found - validate it's a string
  if (filters.specialty && typeof filters.specialty === "string") {
    conditions.push("rndrng_prvdr_type = ?");
    params.push(filters.specialty);
  }

  // Filter by city if found - validate it's a string
  if (filters.city && typeof filters.city === "string") {
    conditions.push("LOWER(rndrng_prvdr_city) LIKE ?");
    // Parameterize the LIKE pattern
    params.push(`%${filters.city.toLowerCase()}%`);
  }

  // Filter by state if found - validate it's a string
  if (filters.state && typeof filters.state === "string") {
    conditions.push("rndrng_prvdr_state_abrvtn = ?");
    params.push(filters.state);
  }

  // Add WHERE clause if we have conditions
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order by relevance (prefer exact matches, then limit)
  // Use parameterized LIMIT - mysql2 supports this
  sql += " ORDER BY rndrng_prvdr_type, rndrng_prvdr_city";
  sql += " LIMIT ?";

  // Add the limit as a parameter (mysql2 will handle the integer conversion)
  params.push(queryLimit);

  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = {
  getFallbackProviders,
  searchProviders,
};
