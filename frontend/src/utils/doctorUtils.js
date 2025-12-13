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

/**
 * Calculates the maximum width needed for doctor cards based on the longest text content
 * @param {Array} doctors - Array of doctor objects
 * @returns {string|null} - CSS width value (e.g., "300px") or null if no doctors
 */
export const calculateMaxCardWidth = (doctors) => {
  if (!doctors || doctors.length === 0) return null;

  // Create a temporary canvas to measure text width accurately
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set font styles to match Material-UI Typography
  const h6Font = "bold 1.25rem 'Roboto', 'Helvetica', 'Arial', sans-serif";
  const subtitleFont = "1rem 'Roboto', 'Helvetica', 'Arial', sans-serif";
  const bodyFont = "0.875rem 'Roboto', 'Helvetica', 'Arial', sans-serif";

  let maxWidth = 0;

  doctors.forEach((doctor) => {
    const name = `${doctor.first_name} ${doctor.last_name}`;
    const specialty = `${doctor.specialty} 🩺`;
    const location = `${doctor.city}, ${doctor.state} • ${doctor.zip}`;

    // Measure each text with appropriate font
    context.font = h6Font;
    const nameWidth = context.measureText(name).width;

    context.font = subtitleFont;
    const specialtyWidth = context.measureText(specialty).width;

    context.font = bodyFont;
    const locationWidth = context.measureText(location).width;

    // Find the maximum width
    maxWidth = Math.max(maxWidth, nameWidth, specialtyWidth, locationWidth);
  });

  // Add padding: CardContent has 16px padding on each side = 32px total
  // Add some extra buffer for safety
  const totalWidth = maxWidth + 48;

  return `${totalWidth}px`;
};
