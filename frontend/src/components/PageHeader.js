import { Typography } from "@mui/material";

const PageHeader = () => {
  return (
    <>
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          marginBottom: "1rem",
          fontSize: { xs: "3.6rem", sm: "5.4rem", md: "6.75rem" },
          fontFamily:
            "'Product Sans', 'Google Sans', 'Quicksand', 'Nunito', 'Arial Rounded MT Bold', Arial, sans-serif",
        }}
      >
        Find Your Doctor
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          textAlign: "center",
          marginBottom: "3rem",
          color: "#555",
          fontSize: { xs: "1.3rem", sm: "2rem" },
          fontStyle: "italic",
          fontFamily:
            "'Product Sans', 'Google Sans', 'Quicksand', 'Nunito', 'Arial Rounded MT Bold', Arial, sans-serif",
        }}
      >
        Describe what you're looking for
      </Typography>
    </>
  );
};

export default PageHeader;
