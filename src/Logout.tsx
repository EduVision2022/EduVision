import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

// Providers
import { usePointsContext } from "./points.tsx";

const Logout = () => {
  const history = useHistory();
  const [pointsProvider, setPointsProvider] = usePointsContext();

  useEffect(() => {
    setPointsProvider(true);
    history.push("/");
  });

  return (
    <div className="logout">
      Esti in curs de deconctare, te rugam sa astepti
    </div>
  );
};
export default Logout;
