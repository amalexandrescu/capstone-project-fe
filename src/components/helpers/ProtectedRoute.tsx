import { Navigate } from "react-router";
import { useAppSelector } from "../../redux/store";

const ProtectedRoute: any = ({
  children,
}: {
  children: React.ReactElement[];
}) => {
  const isLoggedIn = useAppSelector((state) => state.user.successfullyLoggedIn);
  console.log("......", isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
