import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Player from "./Player";
import Header from "./Header";

class App extends React.Component {
  render() {
    return (
      <>
        <header><Header /></header>
        <div className="player"><Player /></div>
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