import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
import config from './config'

export default () => {
  const [user, setUser] = useState(null);

  async function getInfo() {
    await axios.get(`${config.backendPath}/api/info`)
    .then(r => {
      setUser(r.data.user);
    })
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
      {
      user ?
      <>
        Connected to {user.name}
      </>
      : <>
        <i className='fa-brands fa-discord discordIcon'></i>
        Se connecter
      </>
      }
    </button>
  )
}
