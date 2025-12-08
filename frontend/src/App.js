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
  paddingTop: "2rem",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
  fontFamily: "'Poppins', sans-serif",
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
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
});

// ----------------- App Component -----------------
function App() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return alert("Please enter a search query");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location: { city }, limit: 12 }),
      });
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      console.error(err);
      alert("Error fetching results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientContainer>
      <Typography
        variant="h2"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
      >
        Find Your Doctor
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ textAlign: "center", marginBottom: "2rem", color: "#555" }}
      >
        Search by specialty and city to get the best-fit healthcare providers
      </Typography>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginBottom: "2rem" }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="What kind of doctor?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <SearchButton fullWidth onClick={handleSearch}>
            Search
          </SearchButton>
        </Grid>
      </Grid>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />
      )}

      <Grid container spacing={3}>
        {results.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.npi}>
            <StyledCard>
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
    </GradientContainer>
  );
}

export default App;
