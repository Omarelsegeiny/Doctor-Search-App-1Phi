import { Typography } from "@mui/material";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <Typography
      variant="body1"
      sx={{
        textAlign: "center",
        color: "#d32f2f",
        marginBottom: "1.5rem",
        padding: "1rem 2rem",
        maxWidth: "800px",
        margin: "0 auto 1.5rem auto",
        backgroundColor: "#ffebee",
        borderRadius: "8px",
        fontWeight: 500,
      }}
    >
      {message}
    </Typography>
  );
};

export default ErrorMessage;
