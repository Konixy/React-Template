import React, { Component, useState, useEffect, Fragment } from "react";
import axios from "axios";
import config from "./config";
import { TailSpin } from "react-loader-spinner";
import { Link, LinkProps } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { User, Guild, LoggingState, APIResponse } from "./types/Types";
import { AxiosResponse } from "axios";
import { useUser } from "./User.context";
axios.defaults.withCredentials = true;

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function LoggedBtn(): JSX.Element {
  const [state, setState] = useState<LoggingState>({
    loading: true,
    connected: false,
  });
  const { user, setUser } = useUser();

  async function getInfo() {
    const request = axios
      .get(`${config.backendPath}/api/info`)
      .then((r: AxiosResponse<APIResponse>) => {
        if (r.data.success) {
          r.data.user ? setUser(r.data.user) : setUser(null);
          r.data.user
            ? setState({ connected: true, loading: false })
            : setState({ connected: false, loading: false });
        } else {
          setState({ connected: false, loading: false });
        }
      })
      .catch((err) => console.log(err));
  }

  function login() {
    setState({ loading: true, connected: false });
    console.log(window.innerWidth);
    const width = 450;
    const left = (window.innerWidth - width) / 2;
    console.log(left)
    const loginWindow = window.open(
      `${config.backendPath}/api/login`,
      "newwindow",
      `width=${width}, height=${window.innerHeight}, top=${window.innerHeight}, left=${left}`
    );
    const timer = setInterval(() => {
      if (loginWindow) {
        if (loginWindow.closed) {
          getInfo();
          clearInterval(timer);
        }
      }
    }, 500);
  }

  function logout() {
    axios.post(`${config.backendPath}/api/logout`);
    setState({ connected: false, loading: false });
    return setUser(null);
  }

  function displayDrop() {
    const element = document.querySelector(".dropdown") as HTMLElement;
    element.style.display = element.style.display === "none" ? "block" : "none";
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      {user ? (
        state.loading ? (
          <button
            className="flex items-center bg-gray-100 border-0 py-1 px-3 text-black focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
            style={{ width: "75px", height: "32px", justifyContent: "center" }}
          >
            <TailSpin color="black" width="20px" height="20px" />
          </button>
        ) : (
          <div className="drop-container">{Dropdown([state, setState])}</div>
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

function Dropdown([state, setState]: [
  LoggingState,
  React.Dispatch<React.SetStateAction<LoggingState>>
]): JSX.Element {
  const { user, setUser } = useUser();
  function logout() {
    axios.post(`${config.backendPath}/api/logout`);
    setState({ connected: false, loading: false });
    return setUser(null);
  }

  interface DropdownItem
    extends React.HTMLProps<HTMLDivElement | HTMLButtonElement | HTMLLinkElement | LinkProps> {
    type: "link" | "href" | "button";
    name: string;
    href?: string;
  }

  const dropdownItems: DropdownItem[] = [
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
    base: "block px-4 py-2 mx-2 my-1 text-sm cursor-pointer rounded-md",
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center rounded-md dark:text-neutral-300 dark:hover:text-white text-neutral-500 hover:text-neutral-800 px-4 py-2 text-base font-medium focus:outline-none">
          <img
            src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png?size=64`}
            alt={user?.username}
            width="32px"
            height="32px"
            className="rounded-full mr-2"
          />
          <div className="text-base">{user?.username}</div>
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
              e.type === "link" && e.href ? (
                <Menu.Item key={e.name}>
                  {({ active }) => (
                    <Link
                      to={e.href || "/"}
                      className={classNames(
                        active ? baseStyle.active : baseStyle.notActive,
                        baseStyle.base,
                        e.className || ""
                      )}
                    >
                      {e.name}
                    </Link>
                  )}
                </Menu.Item>
              ) : e.type === "href" && e.href ? (
                <Menu.Item key={e.name}>
                  {({ active }) => (
                    <a
                      href={e.href}
                      target="_blank"
                      className={classNames(
                        active ? baseStyle.active : baseStyle.notActive,
                        baseStyle.base,
                        e.className || ""
                      )}
                    >
                      {e.name}
                    </a>
                  )}
                </Menu.Item>
              ) : (
                <Menu.Item key={e.name}>
                  {({ active }) => (
                    <div
                      className={classNames(
                        active ? baseStyle.active : baseStyle.notActive,
                        baseStyle.base,
                        e.className || ""
                      )}
                      onClick={e.onClick}
                    >
                      {e.name}
                    </div>
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
