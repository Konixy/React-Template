import React, { Component, useState, useEffect, Fragment } from "react";
import axios from "axios";
import config from "./config";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { useCookies } from "react-cookie";
// import Dropdown from './Dropdown'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LoggedBtn() {
  const [user, setUser] = useState({ type: "loader" });
  const [cookie, setCookie] = useCookies([]);
  // const {data, error} = useSWR(`${config.backendPath}/api/info`)

  async function getInfo() {
    // axios.defaults.withCredentials = true;
    // const request = axios
    //   .get(`${config.backendPath}/api/info`, {
    //     headers: {
    //       "Cache-Control": "no-cache",
    //       Cookie: document.cookie,
    //     },
    //     credentials: "same-origin"
    //   })
    //   .then((r) => {
    //     setUser(r.data.user);
    //     console.log(r.data)
    //   })
    //   .catch((err) => console.error(err));

    const request = axios.get(`${config.backendPath}/api/info`, {withCredentials: true})
    .then(r => {
      r.data.success ? setUser(r.data.user) : setUser(null)
      console.log(r.data.user)
    })
    .catch(err => console.log(err))
  }

  function login() {
    setUser({ type: "loader" });
    // window.location.href = `${config.backendPath}/api/login`;
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
          {/* target="_blank" href={`${config.backendPath}/api/login`} rel="noopener noreferrer" */}
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
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md dark:text-neutral-300 dark:hover:text-white text-neutral-500 hover:text-neutral-800 px-4 py-2 text-sm font-medium focus:outline-none">
          <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`} alt={user.username} width="32px" height="32px" className="rounded-full" />
          {user.username}
          <i
            className="fa-solid fa-caret-down -mr-2 ml-1 mt-0 flex h-5 w-5 drop-icon text-base"
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black dark:ring-neutral-600 ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-300",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Account settings
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-300",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Support
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-300",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  License
                </a>
              )}
            </Menu.Item>
            <div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={classNames(
                      active
                        ? "bg-gray-100 text-red-600 dark:bg-neutral-700"
                        : "text-red-600",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                    onClick={logout}
                  >
                    Se déconnecter
                  </button>
                )}
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
