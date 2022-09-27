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
import Cookie from "js-cookie"

class App extends React.Component {
  constructor() {
    super()
    this.connectUid = Cookie.get('connect.uid')
  }
  render() {
    return (
      <Router>
        <header><Header cookies={this.connectUid} /></header>
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
