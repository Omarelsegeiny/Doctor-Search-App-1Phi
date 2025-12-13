import { Typography, CardContent } from "@mui/material";
import { StyledCard } from "./styled";
import { handleDoctorClick } from "../utils/doctorUtils";

const DoctorCard = ({ doctor }) => {
  return (
    <StyledCard onClick={() => handleDoctorClick(doctor)}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {doctor.first_name} {doctor.last_name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {doctor.specialty} 🩺
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {doctor.city}, {doctor.state} • {doctor.zip}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default DoctorCard;
