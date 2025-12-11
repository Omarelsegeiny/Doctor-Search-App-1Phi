/**
 * Natural Language Query Parser
 * Extracts specialty, location, and procedures from natural language queries
 */

// Specialty mappings - common terms to database values
const SPECIALTY_MAPPINGS = {
  cardiologist: "Cardiology",
  cardiology: "Cardiology",
  heart: "Cardiology",
  cardiac: "Cardiology",
  dentist: "Dentist",
  dental: "Dentist",
  orthodontist: "Dentist",
  dermatologist: "Dermatology",
  dermatology: "Dermatology",
  skin: "Dermatology",
  neurologist: "Neurology",
  neurology: "Neurology",
  brain: "Neurology",
  orthopedic: "Orthopedic Surgery",
  orthopedist: "Orthopedic Surgery",
  bone: "Orthopedic Surgery",
  psychiatrist: "Psychiatry",
  psychiatry: "Psychiatry",
  mental: "Psychiatry",
  psychologist: "Psychiatry",
  pediatrician: "Pediatrics",
  pediatrics: "Pediatrics",
  children: "Pediatrics",
  child: "Pediatrics",
  ophthalmologist: "Ophthalmology",
  ophthalmology: "Ophthalmology",
  eye: "Ophthalmology",
  optometrist: "Ophthalmology",
  gynecologist: "Obstetrics/Gynecology",
  gynecology: "Obstetrics/Gynecology",
  obgyn: "Obstetrics/Gynecology",
  obstetrician: "Obstetrics/Gynecology",
  oncologist: "Oncology",
  oncology: "Oncology",
  cancer: "Oncology",
  urologist: "Urology",
  urology: "Urology",
  gastroenterologist: "Gastroenterology",
  gastroenterology: "Gastroenterology",
  gi: "Gastroenterology",
  pulmonologist: "Pulmonology",
  pulmonology: "Pulmonology",
  lung: "Pulmonology",
  endocrinologist: "Endocrinology",
  endocrinology: "Endocrinology",
  diabetes: "Endocrinology",
  rheumatologist: "Rheumatology",
  rheumatology: "Rheumatology",
  nephrologist: "Nephrology",
  nephrology: "Nephrology",
  kidney: "Nephrology",
};

// Common procedure/service keywords
const PROCEDURE_KEYWORDS = [
  "ultrasound",
  "x-ray",
  "xray",
  "mri",
  "ct scan",
  "ctscan",
  "surgery",
  "procedure",
  "test",
  "scan",
  "biopsy",
  "colonoscopy",
  "endoscopy",
  "echocardiogram",
  "stress test",
  "mammogram",
  "pap smear",
  "vaccination",
  "vaccine",
  "injection",
  "screening",
];

// Location keywords
const LOCATION_KEYWORDS = [
  "near",
  "in",
  "at",
  "around",
  "close to",
  "downtown",
  "uptown",
  "suburb",
  "suburbs",
];

// US States mapping
const US_STATES = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

/**
 * Parse natural language query to extract search parameters
 * @param {string} query - Natural language query
 * @returns {Object} Parsed query with specialty, location, and procedures
 */
function parseQuery(query) {
  const lowerQuery = query.toLowerCase();
  const parsed = {
    specialty: null,
    location: {
      city: null,
      state: null,
      keyword: null, // e.g., "downtown", "near"
    },
    procedures: [],
    originalQuery: query,
  };

  // Extract specialty
  for (const [key, value] of Object.entries(SPECIALTY_MAPPINGS)) {
    if (lowerQuery.includes(key)) {
      parsed.specialty = value;
      break;
    }
  }

  // Extract procedures
  for (const keyword of PROCEDURE_KEYWORDS) {
    if (lowerQuery.includes(keyword)) {
      parsed.procedures.push(keyword);
    }
  }

  // Extract location
  // Look for state names
  for (const [stateName, stateCode] of Object.entries(US_STATES)) {
    if (lowerQuery.includes(stateName)) {
      parsed.location.state = stateCode;
      break;
    }
  }

  // Look for location keywords
  for (const keyword of LOCATION_KEYWORDS) {
    if (lowerQuery.includes(keyword)) {
      parsed.location.keyword = keyword;
      break;
    }
  }

  // Extract city - look for capitalized words after location keywords or common patterns
  // This is a simple heuristic - could be improved with NLP
  const words = query.split(/\s+/);
  let cityFound = false;

  // Common major cities to look for
  const majorCities = [
    "chicago",
    "new york",
    "los angeles",
    "houston",
    "phoenix",
    "philadelphia",
    "san antonio",
    "san diego",
    "dallas",
    "san jose",
    "austin",
    "jacksonville",
    "san francisco",
    "columbus",
    "fort worth",
    "charlotte",
    "detroit",
    "el paso",
    "seattle",
    "denver",
    "washington",
    "memphis",
    "boston",
    "nashville",
    "baltimore",
    "oklahoma city",
    "portland",
    "las vegas",
    "milwaukee",
    "albuquerque",
    "tucson",
    "fresno",
    "sacramento",
    "kansas city",
    "mesa",
    "atlanta",
    "omaha",
    "colorado springs",
    "raleigh",
    "virginia beach",
    "miami",
    "oakland",
    "minneapolis",
    "tulsa",
    "cleveland",
    "wichita",
    "arlington",
  ];

  for (const city of majorCities) {
    if (lowerQuery.includes(city)) {
      parsed.location.city = city
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      cityFound = true;
      break;
    }
  }

  // If no major city found, try to extract capitalized word after location keyword
  if (!cityFound) {
    for (let i = 0; i < words.length - 1; i++) {
      if (LOCATION_KEYWORDS.some((kw) => words[i].toLowerCase().includes(kw))) {
        // Next capitalized word might be a city
        const nextWord = words[i + 1];
        if (nextWord && nextWord[0] === nextWord[0].toUpperCase()) {
          parsed.location.city = nextWord.replace(/[.,!?]/g, "");
          break;
        }
      }
    }
  }

  return parsed;
}

/**
 * Check if a parsed query has meaningful information
 * @param {Object} parsed - Parsed query object
 * @returns {boolean} - True if query has meaningful info, false otherwise
 */
function hasMeaningfulInfo(parsed) {
  // Check if we extracted any meaningful information
  const hasSpecialty = !!parsed.specialty;
  const hasLocation = !!(parsed.location.city || parsed.location.state);
  const hasProcedures = parsed.procedures.length > 0;

  // Query is meaningful if it has at least one of these
  return hasSpecialty || hasLocation || hasProcedures;
}

/**
 * Check if query is likely gibberish (mostly numbers, special chars, or very short)
 * @param {string} query - Original query string
 * @returns {boolean} - True if query appears to be gibberish
 */
function isLikelyGibberish(query) {
  const trimmed = query.trim();

  // Very short queries (less than 3 chars) are likely not meaningful
  if (trimmed.length < 3) return true;

  // Check if query is mostly numbers or special characters
  const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  const totalChars = trimmed.length;
  const letterRatio = letterCount / totalChars;

  // If less than 30% are letters, likely gibberish
  if (letterRatio < 0.3) return true;

  // Check if it's just numbers
  if (/^\d+$/.test(trimmed.replace(/\s/g, ""))) return true;

  return false;
}

module.exports = { parseQuery, hasMeaningfulInfo, isLikelyGibberish };
