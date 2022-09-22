import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Player from "./Player";
import Header from "./Header";
import Home from "./Home"

class App extends React.Component {
  render() {
    return (
      <>
        <header><Header /></header>
        <main><Home /></main>
        {/* <div className="player"><Player /></div> */}
      </>
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