import { Box } from "@mui/material";
import { SearchTextField, SearchFormContainer, SearchButton } from "./styled";

const SearchForm = ({ query, onQueryChange, onKeyDown, onSearch }) => {
  return (
    <SearchFormContainer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "stretch", sm: "flex-start" },
        }}
      >
        <Box sx={{ flex: 1, width: "100%" }}>
          <SearchTextField
            fullWidth
            placeholder='e.g., "I need a cardiologist who can do an ultrasound near downtown Chicago"'
            value={query}
            onChange={onQueryChange}
            onKeyDown={onKeyDown}
            multiline
            maxRows={3}
          />
        </Box>
        <Box
          sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { sm: "120px" } }}
        >
          <SearchButton fullWidth onClick={onSearch}>
            Search
          </SearchButton>
        </Box>
      </Box>
    </SearchFormContainer>
  );
};

export default SearchForm;
