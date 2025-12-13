import { LoadingContainer, StyledCircularProgress } from "./styled";

const LoadingIndicator = ({ loading }) => {
  if (!loading) return null;

  return (
    <LoadingContainer>
      <StyledCircularProgress />
    </LoadingContainer>
  );
};

export default LoadingIndicator;
