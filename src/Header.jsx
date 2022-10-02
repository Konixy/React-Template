import React, { Component, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
const discordLink = "https://discord.gg/a2CmhsvEvM"
import LoggedBtn from './LoggedBtn'
import { useCookies } from 'react-cookie'
import Cookies from 'js-cookie'

export default class Header extends Component {
    constructor() {
        super()
        this.state = {darkMode: true}
        // [this.cookie, this.setCookie] = useCookies()
    }
    componentDidMount() {
        this.setState({darkMode: localStorage.getItem('darkMode') || true})
    }
    toggleDarkMode = () => {
        localStorage.setItem('darkMode', this.state.darkMode)
        document.querySelector('html').classList.toggle('dark');
        document.querySelector('.darkModeTogglerIcon').classList.toggle('fa-moon')
        document.querySelector('.darkModeTogglerIcon').classList.toggle('fa-brightness')
    }
    render() {
        const navigation = [
            { title: "Commencer", path: "get-started" },
            { title: "A propos", path: "about" },
            { title: "Aide", path: "help" },
            { title: "Support", path: discordLink, targetBlank: true }
        ]
    
        if(this.state.darkMode === true) {
            document.querySelector('html').classList.toggle('dark');
            setTimeout(() => {
                document.querySelector('.darkModeTogglerIcon').classList.toggle('fa-moon')
                document.querySelector('.darkModeTogglerIcon').classList.toggle('fa-brightness')
            }, 5)
        }

        // console.log('dark mode: ', localStorage.getItem('darkMode'))
    
        return (
             
            <nav className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center bg-white">
              <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                <img src="https://cdn.worldvectorlogo.com/logos/spotify-2.svg" alt="SpotiCord" width="30px" height="30px" className='mr-1' />
                <span className='nav-brand dark:text-white'>SpotiCord</span>
              </Link>
              <ul className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center space-y-8 md:space-x-6 md:space-y-0">
                               {
                            navigation.map((item, idx) => {
                                return (
                                <li key={idx} className="text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:text-indigo-600 nav-link">
                                    {(() => {
                                        if(item.targetBlank) {
                                            return (
                                                <a href={item.path} target="_blank">{ item.title }</a>
                                            )
                                        } else {
                                            return (
                                                <Link to={item.path}>{ item.title }</Link>
                                            )
                                        }
                                    })()}
                                </li>
                                )
                            })
                        }
              </ul>
                        <LoggedBtn />
                <div className='darkModeToggler ml-4'>
                    <button onClick={this.toggleDarkMode}><i className='fa-solid fa-moon text-black dark:text-white darkModeTogglerIcon text-lg'></i></button>
                </div>
            </nav>
        )
    }
}