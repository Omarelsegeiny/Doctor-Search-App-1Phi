/**
 * Shows a toast notification for empty search query
 */
export const showEmptyQueryToast = () => {
  // Prevent multiple toasts: only show one at a time
  if (!document.getElementById("nltoast-div-bottom")) {
    const toastDiv = document.createElement("div");
    toastDiv.id = "nltoast-div-bottom";
    toastDiv.innerText = "Please describe what you're looking for";
    toastDiv.style.position = "fixed";
    toastDiv.style.bottom = "-60px"; // Start below the screen
    toastDiv.style.left = "50%";
    toastDiv.style.transform = "translateX(-50%)";
    toastDiv.style.background = "#222";
    toastDiv.style.color = "#fff";
    toastDiv.style.padding = "1rem 2rem";
    toastDiv.style.borderRadius = "999px";
    toastDiv.style.zIndex = "9999";
    toastDiv.style.fontWeight = "bold";
    toastDiv.style.fontSize = "1.1rem";
    toastDiv.style.opacity = "1";
    toastDiv.style.boxShadow = "0 2px 16px #0004";
    toastDiv.style.transition =
      "bottom 0.4s cubic-bezier(.4,2,.5,1), opacity 0.8s";
    document.body.appendChild(toastDiv);

    // Pop up animation: move up into view
    setTimeout(() => {
      toastDiv.style.bottom = "2rem";
    }, 10);

    // Stay for a while, then fade out and slide down
    setTimeout(() => {
      toastDiv.style.opacity = "0";
      toastDiv.style.bottom = "-60px";
      setTimeout(() => {
        if (document.body.contains(toastDiv)) {
          document.body.removeChild(toastDiv);
        }
      }, 800);
    }, 1500);
  }
};

/**
 * Performs a search query against the API
 * @param {string} query - The search query
 * @param {number} limit - Maximum number of results (default: 18)
 * @returns {Promise<{results: Array, message: string|null, isFallback: boolean}>}
 */
export const performSearch = async (query, limit = 18) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query.trim(), limit }),
  });
  const data = await res.json();
  return {
    results: data.results || [],
    message: data.message || null,
    isFallback: data.isFallback || false,
  };
};

/**
 * Handles the search functionality
 * @param {string} query - The search query
 * @param {Object} setters - Object containing state setters
 * @param {Function} setters.setLoading - Function to set loading state
 * @param {Function} setters.setMessage - Function to set message state
 * @param {Function} setters.setIsFallback - Function to set fallback state
 * @param {Function} setters.setResults - Function to set results state
 * @param {Function} setters.setError - Function to set error state for Snackbar
 */
export const handleSearch = async (query, setters) => {
  const { setLoading, setMessage, setIsFallback, setResults, setError } =
    setters;

  if (!query.trim()) {
    showEmptyQueryToast();
    return;
  }

  setLoading(true);
  setMessage(null);
  setIsFallback(false);
  setError(null);

  try {
    const { results, message, isFallback } = await performSearch(query);
    setResults(results);
    setMessage(message);
    setIsFallback(isFallback);
  } catch (err) {
    console.error(err);
    setError("Error fetching results");
  } finally {
    setLoading(false);
  }
};
