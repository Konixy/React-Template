import React, { Component, useState, useEffect, Fragment } from "react";
import axios from "axios";
import config from "./config";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { useCookies } from "react-cookie";
axios.defaults.withCredentials = true;
// import Dropdown from './Dropdown'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LoggedBtn() {
  const [user, setUser] = useState({ type: "loader"})
  const [cookie, setCookie] = useCookies([]);
  // const {data, error} = useSWR(`${config.backendPath}/api/info`)

  async function getInfo() {
    const request = axios
      .get(`${config.backendPath}/api/info`)
      .then((r) => {
        r.data.success ? setUser(r.data.user) : setUser(null);
      })
      .catch((err) => console.log(err));
  }

  function login() {
    setUser({ type: "loader" });
    const width = window.innerWidth * 0.35;
    const height = window.innerHeight * 0.9;
    const loginWindow = window.open(
      `${config.backendPath}/api/login`,
      "newwindow",
      "width=" +
        width +
        ", height=" +
        height +
        ", top=" +
        (window.innerHeight - height) +
        ", left=" +
        (window.innerWidth - width) / 2
    );
    const timer = setInterval(() => {
      if (loginWindow.closed) {
        getInfo();
        clearInterval(timer);
      }
    }, 1000);
  }

  function logout() {
    axios.post(`${config.backendPath}/api/logout`);
    return setUser(null);
  }

  function displayDrop() {
    const style = document.querySelector(".dropdown").style;
    style.display = style.display === "none" ? "block" : "none";
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      {user ? (
        user.type === "loader" ? (
          <button
            className="flex items-center bg-gray-100 border-0 py-1 px-3 text-black focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
            style={{ width: "75px", height: "32px", justifyContent: "center" }}
          >
            <TailSpin color="black" width="20px" height="20px" />
          </button>
        ) : (
          <div className="drop-container">{Dropdown([user, setUser])}</div>
        )
      ) : (
        <button
          onClick={login}
          className="flex items-center bg-gray-100 border-0 py-1 px-3 text-black focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
          style={{ height: "32px", justifyContent: "center" }}
        >
          <i className="fa-brands fa-discord discordIcon text-black"></i>
          Se connecter
        </button>
      )}
    </>
  );
}

function Dropdown([user, setUser]) {
  function logout() {
    axios.post(`${config.backendPath}/api/logout`);
    return setUser(null);
  }
  const dropdownItems = [
    { type: "link", name: "Account settings", href: "/settings" },
    { type: "href", name: "Support", href: config.discordInvite },
    {
      type: "button",
      name: "Se déconnecter",
      onClick: logout,
      className: "text-red-500 dark:text-red-500",
    },
  ];

  const baseStyle = {
    active: "bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-gray-100",
    notActive: "text-gray-700 dark:text-gray-300",
    base: "block px-4 py-2 mx-2 my-1 text-sm rounded-md",
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center rounded-md dark:text-neutral-300 dark:hover:text-white text-neutral-500 hover:text-neutral-800 px-4 py-2 text-base font-medium focus:outline-none">
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
            alt={user.username}
            width="32px"
            height="32px"
            className="rounded-full mr-2"
          />
          <div className="text-base">{user.username}</div>
          <i
            className="fa-solid fa-caret-down -mr-2 ml-1 -translate-y-[0.75px] flex h-5 w-5 drop-icon text-lg"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute text-center right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black dark:ring-neutral-600 ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {dropdownItems.map((e) =>
              e.type === "link" ? (
                <Menu.Item key={e.name}>
                  {({ active }) => (
                    <Link
                      to={e.href}
                      className={classNames(
                        active ? baseStyle.active : baseStyle.notActive,
                        baseStyle.base,
                        e.className ? e.className : ""
                      )}
                    >
                      {e.name}
                    </Link>
                  )}
                </Menu.Item>
              ) : e.type === "href" ? (
                <Menu.Item key={e.name}>
                  {({ active }) => (
                    <a
                      href={e.href}
                      target="_blank"
                      className={classNames(
                        active ? baseStyle.active : baseStyle.notActive,
                        baseStyle.base,
                        e.className
                      )}
                    >
                      {e.name}
                    </a>
                  )}
                </Menu.Item>
              ) : (
                <Menu.Item key={e.name}>
                  {({ active }) => (
                    <button
                      onClick={e.onClick}
                      className={classNames(
                        active ? baseStyle.active : baseStyle.notActive,
                        baseStyle.base,
                        e.className
                      )}
                    >
                      {e.name}
                    </button>
                  )}
                </Menu.Item>
              )
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
