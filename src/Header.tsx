import React from "react";
import { Link } from "react-router-dom";
import LoggedBtn from "./LoggedBtn";
import config from "./config";

interface Navigation {
    title: string,
    path: string,
    targetBlank?: Boolean,
}

export default function Header() {
  const navigation: Navigation[] = [
    { title: "Commencer", path: "get-started" },
    { title: "A propos", path: "about" },
    { title: "Aide", path: "help" },
    { title: "Support", path: config.discordInvite, targetBlank: true },
  ];

  return (
    <nav className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center bg-white dark:bg-[#121212]">
      <Link
        to="/"
        className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
      >
        <img
          src="https://cdn.worldvectorlogo.com/logos/spotify-2.svg"
          alt="SpotiCord"
          width="30px"
          height="30px"
          className="mr-1"
        />
        <span className="nav-brand dark:text-white">SpotiCord</span>
      </Link>
      <ul className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center space-y-8 md:space-x-6 md:space-y-0">
        {navigation.map((item, idx) => {
          return (
            <li
              key={idx}
              className="text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:text-indigo-600 nav-link"
            >
              {(() => {
                if (item.targetBlank) {
                  return (
                    <a href={item.path} target="_blank">
                      {item.title}
                    </a>
                  );
                } else {
                  return <Link to={item.path}>{item.title}</Link>;
                }
              })()}
            </li>
          );
        })}
      </ul>
      <LoggedBtn />
    </nav>
  );
}
