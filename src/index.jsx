import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import "./index.scss";
import Player from "./Player";
import Header from "./Header";
import Home from "./Home"
import NotFound from "./NotFound";
import LoginCallback from "./LoginCallback";
// import { CookieProvider, withCookies } from 'react-cookie'
// import Cookies from "js-cookie";

class App extends React.Component {
  render() {
    // const { cookie } = this.state
    // console.log(cookie)
    return (
      // <CookieProvider>
        <Router>
          <header><Header /></header>
          <main>
            <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route exact path="/app" element={<Player />} />
                  <Route exact path="/api/callback" element={<LoginCallback />} />
                  <Route path="*" element={<NotFound/>}/>

            </Routes>
          </main>
        </Router>
      // </CookieProvider>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
