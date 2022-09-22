import React from 'react'

export default () => {
    return (
        <div className='container mx-auto md:px-40 md:mt-40 md:text-3xl md:font-semibold dark:text-white'>
            Partager la<br />
            <div className='gradient'>
                <div className='md:text-5xl md:mb-4'>musique</div>
                <a href='https://google.com' target="_blank" className='btn md:text-xl text-white'>Commencer à écouter</a>
            </div>
            {/* <span className='gradientText md:text-5xl'>musique</span> */}
        </div>
    )
}