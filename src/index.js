import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "./index.css";
import Player from "./Player";
import Header from "./Header";
import Home from "./Home"
import NotFound from "./NotFound";

class App extends React.Component {
  render() {
    return (
      <Router>
        <header><Header /></header>
        <Routes>
          <Route exact path="/" element={<main><Home /></main>} />
          <Route exact path="/app" element={<main><Player /></main>} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// "eslintConfig": {
//   "extends": [
//     "react-app",
//     "react-app/jest"
//   ]
// },