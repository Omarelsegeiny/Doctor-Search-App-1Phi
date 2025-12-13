/**
 * Builds a Google search URL from doctor information
 * @param {Object} doctor - Doctor object with first_name, last_name, specialty, city
 * @returns {string} Google search URL
 */
export const buildGoogleSearchUrl = (doctor) => {
  const searchTerms = [
    doctor.first_name,
    doctor.last_name,
    doctor.specialty,
    doctor.city,
  ]
    .filter((term) => term && term.trim()) // Remove empty values
    .map((term) => term.trim().replace(/\s+/g, "+")) // Replace spaces with + for URL
    .join("+");

  return `https://www.google.com/search?q=${searchTerms}`;
};

/**
 * Opens a Google search for the doctor in a new window
 * @param {Object} doctor - Doctor object with first_name, last_name, specialty, city
 */
export const handleDoctorClick = (doctor) => {
  const googleSearchUrl = buildGoogleSearchUrl(doctor);
  window.open(googleSearchUrl, "_blank", "noopener,noreferrer");
};
