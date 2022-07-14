import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { NotificationsProvider } from "@mantine/notifications";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

// Components import
import Home from "./Home";
import Theme from "./Theme";
import HeaderMiddle from "./Navbar";
import store from "./store";
import Footer from "./Footer";
import Generator from "./Generator";
import NotFoundTitle from "./404Page";
import Orare from "./Orare.tsx";
import View from "./View.tsx";
import Intrebari from "./Intrebari.tsx";
import Profile from "./Profile.tsx";
import About from "./About.tsx";
import Contact from "./Contact.tsx";
import Store from "./Store.tsx";
import Login from "./Login.tsx";
import Logout from "./Logout.tsx";

import React from "react";

// Providers
import { PointsProvider } from "./points.tsx";
import { RefreshProvider } from "./Refresh.tsx";

import { createContext } from "react";
export const UpdateContext = createContext();

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const [update, setUpdate] = useState("Testing");

  return (
    <GoogleOAuthProvider clientId="659959791723-d4cg060bjtk048i427hmblvng5q6g7ne.apps.googleusercontent.com">
      <Router>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{
              colorScheme,
              primaryColor: colorScheme == "dark" ? "violet" : "blue",
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <NotificationsProvider>
              <Provider store={store}>
                <RefreshProvider>
                  <PointsProvider>
                    <div className="App">
                      <UpdateContext.Provider value={update}>
                        <HeaderMiddle update={update} />
                        <Switch>
                          <Route exact path="/" component={Home} />
                          <Route path="/about" component={About} />
                          <Route path="/generator" component={Generator} />
                          <Route exact path="/orare" component={Orare} />
                          <Route exact path="/orare/view" component={View} />
                          <Route path="/intrebari" component={Intrebari} />
                          <Route path="/profile" component={Profile} />
                          <Route path="/contact" component={Contact} />
                          <Route path="/store" component={Store} />
                          <Route path="/login" component={Login} />
                          <Route path="/logout" component={Logout} />
                          <Route path="*" component={NotFoundTitle} />
                        </Switch>
                        <Footer />
                      </UpdateContext.Provider>
                    </div>
                  </PointsProvider>
                </RefreshProvider>
              </Provider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
//
