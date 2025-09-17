import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { getAccessToken, isAccessTokenValid } from "./token";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const token = getAccessToken();
  const location = useLocation();
  const tokenIsValid = isAccessTokenValid(token);

  return tokenIsValid ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  );
};

export default RequireAuth;
