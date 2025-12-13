import { Card } from "@mui/material";
import { styled } from "@mui/system";

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

export default StyledCard;
