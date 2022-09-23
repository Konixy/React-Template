import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
import config from './config'
import {TailSpin} from 'react-loader-spinner'
import { Link } from 'react-router-dom'

export default () => {
  const [user, setUser] = useState({type: 'loader'});

  async function getInfo() {
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
          <button className="drop-btn text-black dark:text-white flex flex-row items-center" onClick={displayDrop}>
          {user.avatar ? <img
            src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png"
            className="avatar rounded-3"/> : <img
            src="https://cdn2.clc2l.fr/t/d/i/discord-4OXyS2.png"
      className="avatar" width="25px" height="25px" /> } { user.name }
        </button>
          <ul className="dropdown" style={{display: "none"}}>
          {/* <Link className="drop" to="/panel" style={{color: "#9c9fa9"}}>Mes serveurs</Link> */}
          <li><button className="drop" onClick={logout} style={{color: "#912734"}}>Se déconnecter</button></li>
        </ul>
        </div>)
      : 
        <button onClick={login} className="flex items-center bg-gray-100 border-0 py-1 px-3 text-black focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" style={{height: '32px', justifyContent: "center"}}>
          {/* target="_blank" href={`${config.backendPath}/api/login`} rel="noopener noreferrer" */}
          <i className='fa-brands fa-discord discordIcon'></i>
          Se connecter
        </button>
      }
    </>
  )
}
