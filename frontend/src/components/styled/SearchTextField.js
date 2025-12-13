import { TextField } from "@mui/material";
import { styled } from "@mui/system";

const SearchTextField = styled(TextField)({
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
});

export default SearchTextField;
