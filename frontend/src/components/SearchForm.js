import { Grid } from "@mui/material";
import { SearchTextField, SearchFormContainer, SearchButton } from "./styled";

const SearchForm = ({ query, onQueryChange, onKeyDown, onSearch }) => {
  return (
    <SearchFormContainer container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={11} md={11.5} lg={12}>
        <SearchTextField
          fullWidth
          placeholder='e.g., "I need a cardiologist who can do an ultrasound near downtown Chicago"'
          value={query}
          onChange={onQueryChange}
          onKeyDown={onKeyDown}
          multiline
          maxRows={3}
        />
      </Grid>
      <Grid item xs={12} sm={3} md={2}>
        <SearchButton fullWidth onClick={onSearch}>
          Search
        </SearchButton>
      </Grid>
    </SearchFormContainer>
  );
};

export default SearchForm;
