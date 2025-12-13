import { Button } from "@mui/material";
import { styled } from "@mui/system";

const SearchButton = styled(Button)({
  background: "linear-gradient(to right, #FF416C, #FF4B2B)",
  color: "#fff",
  fontWeight: "bold",
  height: "56px",
  borderRadius: 24,
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    background: "linear-gradient(to right, #FF4B2B, #FF416C)",
  },
});

export default SearchButton;
