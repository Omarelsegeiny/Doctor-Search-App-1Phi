import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

// ----------------- Styled Components -----------------
const GradientContainer = styled(Container)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
  fontFamily: "'Poppins', sans-serif",
  display: "flex",
  flexDirection: "column",
  paddingTop: "2rem",
  paddingBottom: "2rem",
});

const SearchButton = styled(Button)({
  background: "linear-gradient(to right, #FF416C, #FF4B2B)",
  color: "#fff",
  fontWeight: "bold",
  height: "100%",
  "&:hover": {
    background: "linear-gradient(to right, #FF4B2B, #FF416C)",
  },
});

const StyledCard = styled(Card)({
  borderRadius: 16,
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
});

const SearchSection = styled("div")(({ hasResults }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: hasResults ? 0 : 1,
  minHeight: hasResults ? "auto" : "60vh",
  marginBottom: hasResults ? "3rem" : "0",
  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: hasResults ? "translateY(-20px)" : "translateY(0)",
  opacity: 1,
}));

// ----------------- App Component -----------------
function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
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
      return;
    }
    setLoading(true);
    setMessage(null);
    setIsFallback(false);
    try {
      const res = await fetch("http://localhost:5001/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), limit: 18 }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setMessage(data.message || null);
      setIsFallback(data.isFallback || false);
    } catch (err) {
      console.error(err);
      alert("Error fetching results");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleDoctorClick = (doctor) => {
    // Build Google search query: "FirstName LastName Specialty City"
    const searchTerms = [
      doctor.first_name,
      doctor.last_name,
      doctor.specialty,
      doctor.city,
    ]
      .filter((term) => term && term.trim()) // Remove empty values
      .map((term) => term.trim().replace(/\s+/g, "+")) // Replace spaces with + for URL
      .join("+");

    const googleSearchUrl = `https://www.google.com/search?q=${searchTerms}`;

    window.open(googleSearchUrl, "_blank", "noopener,noreferrer");
  };

  const hasResults = results.length > 0;

  return (
    <GradientContainer>
      <SearchSection hasResults={hasResults}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: { xs: "3.6rem", sm: "5.4rem", md: "6.75rem" },
            fontFamily:
              "'Product Sans', 'Google Sans', 'Quicksand', 'Nunito', 'Arial Rounded MT Bold', Arial, sans-serif",
          }}
        >
          Find Your Doctor
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            textAlign: "center",
            marginBottom: "3rem",
            color: "#555",
            fontSize: { xs: "1.3rem", sm: "2rem" },
            fontStyle: "italic",
            fontFamily:
              "'Product Sans', 'Google Sans', 'Quicksand', 'Nunito', 'Arial Rounded MT Bold', Arial, sans-serif",
          }}
        >
          Describe what you're looking for
        </Typography>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{
            width: "100%",
            marginBottom: "1rem",
            maxWidth: { xs: "90%", sm: "800px", md: "900px" },
          }}
        >
          <Grid item xs={12} sm={11} md={11.5} lg={11}>
            <TextField
              fullWidth
              placeholder='e.g., "I need a cardiologist who can do an ultrasound near downtown Chicago"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={3}
              sx={{
                minWidth: { xs: "100%", sm: "550px", md: "650px", lg: "800px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 24,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <SearchButton
              fullWidth
              onClick={handleSearch}
              sx={{
                height: "56px",
                borderRadius: 24,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Search
            </SearchButton>
          </Grid>
        </Grid>

        <div
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
            transition: "opacity 0.3s ease",
          }}
        >
          {loading && (
            <CircularProgress
              sx={{
                display: "block",
                transition: "opacity 0.3s ease",
              }}
            />
          )}
        </div>
      </SearchSection>

      {message && (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "#d32f2f",
            marginBottom: "1.5rem",
            padding: "1rem 2rem",
            maxWidth: "800px",
            margin: "0 auto 1.5rem auto",
            backgroundColor: "#ffebee",
            borderRadius: "8px",
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}

      {hasResults && (
        <>
          {isFallback && (
            <Typography
              variant="subtitle2"
              sx={{
                textAlign: "center",
                color: "#666",
                marginBottom: "1rem",
                fontStyle: "italic",
              }}
            >
              Showing popular specialties as suggestions:
            </Typography>
          )}
          <Grid
            container
            spacing={3}
            sx={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            {results.map((r) => (
              <Grid item xs={12} sm={6} md={4} key={r.npi}>
                <StyledCard onClick={() => handleDoctorClick(r)}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {r.first_name} {r.last_name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {r.specialty} 🩺
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {r.city}, {r.state} • {r.zip}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </GradientContainer>
  );
}

export default App;
