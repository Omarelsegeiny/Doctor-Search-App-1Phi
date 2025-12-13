import { LoadingContainer, StyledCircularProgress } from "./styled";

const LoadingIndicator = ({ loading }) => {
  return (
    <LoadingContainer>{loading && <StyledCircularProgress />}</LoadingContainer>
  );
};

export default LoadingIndicator;
