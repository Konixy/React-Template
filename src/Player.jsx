import React, { Component, useEffect, useState } from "react";
import moment from "moment";
import { IntervalTimer } from "./Util";
import { Oval } from 'react-loader-spinner';
import jQuery from "jquery";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3 * 60, // this.props.seek
      duration: 3 * 60 + 20, // this.props.server.currentTrack.duration
      paused: false,
      loading: false,
      serverId: "839183010"
    };
  }
  handleChange = (event) => {
    if(this.state.loading || document.querySelector('.pauseBtn').disabled) return;
    this.setState({ value: Number(event.target.value) });
  };
  updateState = () => {
    this.interval = new IntervalTimer("seekInterval", () => {
      this.setState({ value: this.state.value + 1 });
    }, 1000);
    this.interval.start()
  };
  componentDidMount() {
    this.updateState()
    this.updateProgressBar()
  }
  pause = () => {
    if(this.state.loading || document.querySelector('.pauseBtn').disabled) return;
    // console.log(this.state)
    if(!this.state.paused) {
      this.interval.pause()
      this.setState({paused: !this.state.paused})
    } else if(this.state.paused) {
      this.interval.resume()
      this.setState({paused: !this.state.paused})
    }
  };
  setLoading = () => {
    this.state.value = 0
    this.state.paused = true
    this.state.loading = true
    this.interval.pause()
    document.querySelector('.pauseBtn').disabled = true
    document.querySelector('#progressBar').disabled = true
    this.render()
  }
  updateProgressBar = () => {
    const progressBar = document.querySelector('#progressBar')
    if(progressBar) {
      const min = progressBar.min,
      max = progressBar.max,
      val = progressBar.value;
      jQuery(progressBar).css({'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'})
    }
  }
  render() {
    if(!this.state.paused) {
      this.interval ? this.interval.resume() : "";
      // this.setState({paused: !this.state.paused})
    } else if(this.state.paused) {
      this.interval ? this.interval.pause() : "";
      // this.setState({paused: !this.state.paused})
    }
    if(this.state.value > this.state.duration) this.setLoading();

    if(this.state.loading) {
      jQuery('#progressBar').css({backgroundSize: "0% 100%"})
    } else {
      this.updateProgressBar();
    }

    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
        console.log('connected')
        ws.send(JSON.stringify({event: "heartbeat", serverId: this.serverId}))
        setInterval(() => {
            ws.send(JSON.stringify({event: "heartbeat", serverId: this.serverId}))
        }, 5000)
    }
    ws.onmessage = (msg => {
        console.log(msg.data)
    })
    function pauseAction() {
        console.log(ws.readyState)
        ws.send(JSON.stringify({event: 'paused', serverId: this.serverId}));
    }
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
                htmlFor="seek"
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
                  max={this.state.duration}
                  value={this.state.value}
                  step="1"
                  onChange={this.handleChange}
                  className="w-full h-1.5 outline-none bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
              <div className="text-green-500 dark:text-neutral-100">
                {moment(this.state.value * 1000).format("mm[:]ss")}
              </div>
              <div className="text-neutral-500 dark:text-neutral-400">
                {moment(this.state.duration * 1000).format("mm[:]ss")}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-neutral-50 text-neutral-500 dark:bg-neutral-600 dark:text-neutral-200 rounded-b-xl flex items-center">
          <div className="flex-auto flex items-center justify-evenly">
            <button type="button" aria-label="Add to favorites" className="text-neutral-500 dark:text-neutral-200">
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
            <button type="button" aria-label="Previous">
              <i className="fa-solid fa-backward-step text-neutral-500 dark:text-neutral-200 text-xl"></i>
            </button>
          </div>
          <button
            type="button"
            className="pauseBtn bg-white text-neutral-900 dark:bg-neutral-100 dark:text-neutral-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-neutral-900/5 shadow-md flex items-center justify-center"
            aria-label="Pause"
            onClick={this.pause}
          >
            {PauseBtn(this.state)}
            {/* {this.state.paused ? <i className="fa-solid fa-play text-3xl -mr-1"></i> : <i className="fa-duotone fa-pause text-4xl"></i>} */}
          </button>
          <div className="flex-auto flex items-center justify-evenly">
            <button type="button" aria-label="Next">
              <i className="fa-solid fa-forward-step text-neutral-500 dark:text-neutral-200 text-xl"></i>
            </button>
            <button type="button">
              <i className="fa-solid fa-volume"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function PauseBtn(state) {
  if(!state.loading) {
    if(state.paused) {
      return <i className="fa-solid fa-play text-3xl -mr-1"></i>
    } else {
      return <i className="fa-duotone fa-pause text-4xl"></i>
    }
  } else if (state.loading) {
    // text-neutral-900 dark:text-neutral-700
    let color;
    if(document.querySelector('html').classList.contains('dark')) {
      color = "#404040"
    } else color = "#171717";
    return <Oval color={color} secondaryColor="transparent" width="40px" height="40px" />
  }
}