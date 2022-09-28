import React, { Component, useEffect } from "react";

export default class Player extends Component {
  render() {
    return (
      <div>
        <div className="bg-white border-neutral-100 dark:bg-neutral-800 dark:border-neutral-500 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
          <div className="flex items-center space-x-4">
            <img
              src="/full-stack-radio.png"
              alt=""
              width={88}
              height={88}
              className="flex-none rounded-lg bg-neutral-100"
              loading="lazy"
            />
            <div className="min-w-0 flex-auto space-y-1 font-semibold">
              <p className="text-green-500 dark:text-green-400 text-sm leading-6">
                {"Artist"}
              </p>
              <h2 className="text-neutral-500 dark:text-neutral-400 text-sm leading-6 truncate">
                {"Album"}
              </h2>
              <label
                for="seek"
                className="text-neutral-900 dark:text-neutral-50 text-lg"
              >
                {"Musique"}
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <div className="rounded-full overflow-hidden">
                <input
                  name="seek"
                  id="progressBar"
                  type="range"
                  min="0"
                  max="10"
                  value="5"
                  step="1"
                  onChange={onSeekChange}
                  class="w-full h-2 outline-none bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
              <div className="text-green-500 dark:text-neutral-100">1:15</div>
              <div className="text-neutral-500 dark:text-neutral-400">3:05</div>
            </div>
          </div>
        </div>
        <div className="bg-neutral-50 text-neutral-500 dark:bg-neutral-600 dark:text-neutral-200 rounded-b-xl flex items-center">
          <div className="flex-auto flex items-center justify-evenly">
            <button type="button" aria-label="Add to favorites">
              <svg width={24} height={24}>
                <path
                  d="M7 6.931C7 5.865 7.853 5 8.905 5h6.19C16.147 5 17 5.865 17 6.931V19l-5-4-5 4V6.931Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button type="button" className="block" aria-label="Previous">
              <svg width={24} height={24} fill="none">
                <path
                  d="m10 12 8-6v12l-8-6Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6v12"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <button
            type="button"
            className="bg-white text-neutral-900 dark:bg-neutral-100 dark:text-neutral-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-neutral-900/5 shadow-md flex items-center justify-center"
            aria-label="Pause"
          >
            <svg width={30} height={32} fill="currentColor">
              <rect x={6} y={4} width={4} height={24} rx={2} />
              <rect x={20} y={4} width={4} height={24} rx={2} />
            </svg>
          </button>
          <div className="flex-auto flex items-center justify-evenly">
            <button type="button" className="block" aria-label="Next">
              <svg width={24} height={24} fill="none">
                <path
                  d="M14 12 6 6v12l8-6Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 6v12"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-neutral-500 text-neutral-500 dark:text-neutral-100 dark:ring-0 dark:bg-neutral-500"
            >
              1x
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function onSeekChange(event) {
  console.log(event)
}