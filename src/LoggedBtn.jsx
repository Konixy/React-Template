import React, { Component, useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import config from './config'
import {TailSpin} from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
// import Dropdown from './Dropdown'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default () => {
  const [user, setUser] = useState({type: 'loader'});

  async function getInfo() {
    console.log(document.cookie)
    await axios.get(`${config.backendPath}/api/info`)
    .then(r => {
      setUser(r.data.user);
    })
  }

  function login() {
    setUser({type: 'loader'})
    const width = window.innerWidth * 0.35 ;
    const height = (width * window.innerHeight / window.innerWidth) * 2;
    const loginWindow = window.open(`${config.backendPath}/api/login` , 'newwindow', 'width=' + width + ', height=' + height + ', top=' + ((window.innerHeight - height) / 2) + ', left=' + ((window.innerWidth - width) / 2));
    const timer = setInterval(() => {
      if(loginWindow.closed) {
        getInfo();
        clearInterval(timer)
      }
    }, 1000)
  }
  
  function logout() {
    axios.post(`${config.backendPath}/api/logout`)
    return setUser(null)
  }

  function displayDrop() {
    const style = document.querySelector(".dropdown").style
    style.display = style.display === "none" ? "block" : "none"
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <>
      {
      user ?
      (user.type === 'loader' ? 
      <button className="flex items-center bg-gray-100 border-0 py-1 px-3 text-black focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" style={{width: "75px", height: "32px", justifyContent: "center"}}>
        <TailSpin color='black' width='20px' height="20px" />
      </button> :
          // <button className="flex items-center bg-gray-100 border-0 py-1 px-3 text-black focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" style={{height: '32px', justifyContent: "center"}}>
          //   {user.name}
          // </button>)
          <div className='drop-container'>
           {/* <button className="drop-btn text-black dark:text-white flex flex-row items-center" onClick={displayDrop}> */}
           {/* user.avatar ? <img
            src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png"
            className="avatar rounded-3"/> : <img
            src="https://cdn2.clc2l.fr/t/d/i/discord-4OXyS2.png"
      className="avatar" width="25px" height="25px" /> */} {/* user.name */}
        {/* </button>
          <ul className="dropdown" style={{display: "none"}}> */}
          {/* <Link className="drop" to="/panel" style={{color: "#9c9fa9"}}>Mes serveurs</Link> */}
          {/* <li><button className="drop" onClick={logout} style={{color: "#912734"}}>Se déconnecter</button></li>
        </ul> */}
        {Dropdown([user, setUser])}
        </div>)
      : 
        <button onClick={login} className="flex items-center bg-gray-100 border-0 py-1 px-3 text-black focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" style={{height: '32px', justifyContent: "center"}}>
          {/* target="_blank" href={`${config.backendPath}/api/login`} rel="noopener noreferrer" */}
          <i className='fa-brands fa-discord discordIcon text-black'></i>
          Se connecter
        </button>
      }
    </>
  )
}

function Dropdown([user, setUser]) {
  function logout() {
    axios.post(`${config.backendPath}/api/logout`)
    return setUser(null)
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white dark:bg-transparent dark:text-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-black">
          {user.name}
          <i className="fa-solid fa-caret-down -mr-2 ml-1 mt-0 flex h-5 w-5 text-gray-700 dark:text-white drop-icon text-base" aria-hidden="true" />
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
                    active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                    'block px-4 py-2 text-sm'
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
                    active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                    'block px-4 py-2 text-sm'
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
                    active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                    'block px-4 py-2 text-sm'
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
                      active ? 'bg-gray-100 text-red-600 dark:bg-neutral-700' : 'text-red-600',
                      'block w-full px-4 py-2 text-left text-sm'
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
  )
}