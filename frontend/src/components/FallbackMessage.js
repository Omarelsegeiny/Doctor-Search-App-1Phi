import { Typography } from "@mui/material";

const FallbackMessage = ({ show }) => {
  if (!show) return null;

  return (
    <Typography
      variant="subtitle2"
      sx={{
        textAlign: "center",
        color: "#666",
        marginBottom: "1rem",
        fontStyle: "italic",
      }}
    >
      Showing popular specialties as suggestions:
    </Typography>
  );
};

export default FallbackMessage;
