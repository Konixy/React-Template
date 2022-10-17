import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { btn2 } from './Util'

export default () => {
    return (
        <section className="flex items-center h-full p-16 dark:text-neutral-100">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-neutral-600">
                        <span className="sr-only">Error </span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">Désolé, cette page n'éxiste pas.</p>
                    <p className="mt-4 mb-8 dark:text-neutral-400">Mais ne vous inquietez pas, vous pourrez trouver plein d'autres choses sur notre page d'acceuil.</p>
                    <Link rel="noopener noreferrer" to="/" className={btn2}>Retour a l'acceuil</Link>
                </div>
            </div>
        </section>
    )
}
