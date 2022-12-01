import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/index.scss";
import Player from "./Player";
import Header from "./Header";
import Home from "./Home";
import NotFound from "./NotFound";
import GetStarted from "./GetStarted";
import { UserContext } from "./User.context";
import { User } from "./types/Types";

function App() {
  const [user, setUser] = useState<User | null>(null);
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <header>
          <Header />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/app" element={<Player />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </UserContext.Provider>
    </Router>
  );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
