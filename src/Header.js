import React, { Component, useState, useEffect } from 'react'
const discordLink = "https://discord.gg/a2CmhsvEvM"

export default () => {
    const [state, setState] = useState(false)

    const navigation = [
        { title: "Commencer", path: "javascript:void(0)" },
        { title: "A propos", path: "javascript:void(0)" },
        { title: "Aide", path: "javascript:void(0)" },
        { title: "Support", path: discordLink, targetBlank: true }
    ]

    const useThemeDetector = () => {
        const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
        const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());  
        const mqListener = (e => {
            setIsDarkTheme(e.matches);
        });
        
        useEffect(() => {
          const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
          darkThemeMq.addEventListener("change", mqListener);
          return () => darkThemeMq.removeEventListener("change", mqListener);
        }, []);
        return isDarkTheme;
    }

    if(useThemeDetector()) {
        setTimeout(() => {
            toggleDarkMode()
        }, 50)
    }
    console.log(useThemeDetector())

    function toggleDarkMode() {
        document.querySelector('html').classList.toggle('dark');
        document.querySelector('.darkModeTogglerIcon').classList.toggle('fa-moon')
        document.querySelector('.darkModeTogglerIcon').classList.toggle('fa-brightness')
    }

    return (
        <nav className="bg-white dark:bg-dark w-full border-b md:border-0 md:static">
        <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
                <a href="/" className='nav-brand dark:text-white'>SpotiCord</a>
                <div className="md:hidden">
                    <button className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                        onClick={() => setState(!state)}
                    >
                        {
                            state ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                            )
                        }
                    </button>
                </div>
            </div>
            <div className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${ state ? 'block' : 'hidden'}`}>
                <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                    {
                        navigation.map((item, idx) => {
                            return (
                            <li key={idx} className="text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:text-indigo-600 nav-link">
                                <a href={item.path} target={item.targetBlank ? '_blank' : "_self"}>
                                    { item.title }
                                </a>
                            </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="hidden md:inline-block">
            <a href="javascript:void(0)" className="py-3 px-4 text-white rounded-md shadow discordBtn">
                <i className='fa-brands fa-discord discordIcon'></i>
                Se connecter
            </a>
            </div>
            <div className='darkModeToggler ml-4'>
                <button onClick={toggleDarkMode}><i className='fa-solid fa-moon text-black dark:text-white darkModeTogglerIcon text-lg'></i></button>
            </div>
        </div>
    </nav>
    )
}