import { TextField } from "@mui/material";
import { styled } from "@mui/system";

const SearchTextField = styled(TextField)({
  width: "100%",
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
