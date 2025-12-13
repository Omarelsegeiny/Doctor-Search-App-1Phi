import { Container } from "@mui/material";
import { styled } from "@mui/system";

const GradientContainer = styled(Container)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
  fontFamily: "'Poppins', sans-serif",
  display: "flex",
  flexDirection: "column",
  paddingTop: "2rem",
  paddingBottom: "2rem",
});

export default GradientContainer;
