import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "./index.scss";
import Player from "./Player";
import Header from "./Header";
import Home from "./Home"
import NotFound from "./NotFound";

class App extends React.Component {
  render() {
    return (
      <Router>
        <header><Header /></header>
        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/app" element={<Player />} />
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </main>
      </Router>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
