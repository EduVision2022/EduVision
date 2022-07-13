import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

// Providers
import { usePointsContext } from "./points.tsx";

const Login = () => {
  const history = useHistory();
  const [pointsProvider, setPointsProvider] = usePointsContext();

  useEffect(() => {
    setPointsProvider(true);
    history.push("/");
  });

  return <div className="Login">testing</div>;
};
export default Login;
