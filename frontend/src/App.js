import { useState } from "react";
import { Grid, Snackbar, Alert } from "@mui/material";
import {
  GradientContainer,
  SearchSection,
  ResultsGrid,
} from "./components/styled";
import { handleSearch } from "./utils/searchUtils";
import PageHeader from "./components/PageHeader";
import ErrorMessage from "./components/ErrorMessage";
import FallbackMessage from "./components/FallbackMessage";
import DoctorCard from "./components/DoctorCard";
import SearchForm from "./components/SearchForm";
import LoadingIndicator from "./components/LoadingIndicator";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [error, setError] = useState(null);

  const onSearch = () => {
    handleSearch(query, {
      setLoading,
      setMessage,
      setIsFallback,
      setResults,
      setError,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSearch();
    }
  };

  const hasResults = results.length > 0;

  return (
    <GradientContainer>
      <SearchSection hasResults={hasResults}>
        <PageHeader />

        <SearchForm
          query={query}
          onQueryChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onSearch={onSearch}
        />

        <LoadingIndicator loading={loading} />
      </SearchSection>

      <ErrorMessage message={message} />

      {hasResults && (
        <>
          <FallbackMessage show={isFallback} />
          <ResultsGrid container spacing={3}>
            {results.map((r) => (
              <Grid item xs={12} sm={6} md={4} key={r.npi}>
                <DoctorCard doctor={r} />
              </Grid>
            ))}
          </ResultsGrid>
        </>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </GradientContainer>
  );
}

export default App;
