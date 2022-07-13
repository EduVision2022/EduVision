import { createContext, useContext, useState } from "react";

const Context = createContext(0);

export function RefreshProvider({ children }) {
  const [refreshValue, setRefreshValue] = useState(0);
  return (
    <Context.Provider value={[refreshValue, setRefreshValue]}>
      {children}
    </Context.Provider>
  );
}

export function useRefreshContext() {
  return useContext(Context);
}
