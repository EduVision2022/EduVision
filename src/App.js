import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";

// Components import
import Home from "./Home";
import Theme from "./Theme";
import HeaderMiddle from "./Navbar";
import store from "./store";
import About from "./About";

function App() {
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <GoogleOAuthProvider clientId="659959791723-d4cg060bjtk048i427hmblvng5q6g7ne.apps.googleusercontent.com">
      <Router>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{ colorScheme }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Provider store={store}>
              <div className="App">
                <HeaderMiddle />
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/about" component={About} />
                </Switch>
              </div>
            </Provider>
          </MantineProvider>
        </ColorSchemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
//
