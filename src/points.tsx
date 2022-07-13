import { createContext, useContext, useState } from "react";

const Context = createContext(0);

export function PointsProvider({ children }) {
  const [pointsProvider, setPointsProvider] = useState(false);
  return (
    <Context.Provider value={[pointsProvider, setPointsProvider]}>
      {children}
    </Context.Provider>
  );
}

export function usePointsContext() {
  return useContext(Context);
}
