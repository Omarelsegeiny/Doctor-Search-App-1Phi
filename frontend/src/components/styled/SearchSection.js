import { styled } from "@mui/system";

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

export default SearchSection;
