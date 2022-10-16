import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
    return (
        <div className='container mx-auto md:px-40 md:mt-40 md:text-3xl md:font-semibold dark:text-white'>
            Partage ta<br />
            <div className='gradient'>
                <div className='md:text-5xl md:mb-4'>musique</div>
                <Link to="/get-started" className='btn md:text-xl text-white'>Commencer à écouter</Link>
            </div>
        </div>
    )
}