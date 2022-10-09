import React, { Component, useEffect, useState } from "react";
import moment from "moment";
import { IntervalTimer } from "./Util";
import { Oval } from "react-loader-spinner";
import jQuery from "jquery";
import WebSocketPlayer from "./WebSocketPlayer";
import config from "./config";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
const Spotify = new SpotifyWebApi({
  clientId: config.spotifyClientId,
  clientSecret: config.spotifyClientSecret,
  accessToken: config.spotifyToken,
});

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0, // this.props.seek
      duration: 0, // this.props.server.currentTrack.duration
      paused: true,
      playing: false,
      serverId: config.localDevServerId,
      ws: null,
      track: {
        name: "Rien pour le moment.",
        albumName: "",
        artists: [],
        coverUrl: null,
        url: null,
        id: null,
      },
    };
  }
  updateState = () => {
    this.interval = new IntervalTimer(
      "seekInterval",
      () => {
        this.state.value++;
      },
      1000
    );
    this.interval.start();
  };
  updateInfo = async (data) => {
    console.log(data)
    let newState = {}
    if (!data.success) {
      newState = { playing: false, paused: true };
      this.setState(newState);
      return this.render();
    }
    if (data.currentTrack.duration)
      newState.duration = Math.floor(data.currentTrack.duration / 1000);
    else newState.duration = 0;
    if(data.seek)
      newState.value = Math.floor(data.seek / 1000)
    else newState.value = 0;
    if (data.currentTrack.id) {
      newState.track = data.currentTrack;
      newState.playing = true;
      // console.log(data.currentTrack.id)
      Spotify.getTrack(data.currentTrack.id)
        .then((r) => {
          newState.track.albumName = r.body.album.name;
          newState.track.artists = r.body.artists || [];
          newState.track.coverUrl = r.body.album.images.filter(
            (e) => e.width >= 300 && e.width <= 400
          )[0].url;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      newState.playing = false;
    }
    newState.paused = data.paused;
    this.setState(newState);
  };
  componentDidMount() {
    this.updateState();
    this.setUpWs();
  }
  setUpWs = () => {
    this.ws = new WebSocketPlayer(this.state.serverId, (msg) => {
      const data = JSON.parse(msg.data);
      if (data.event === "heartbeat") return;
      this.updateInfo(data);
    });
    this.ws.init();
  };
  pause = () => {
    if (!this.state.playing || document.querySelector(".pauseBtn").disabled)
      return;
    this.ws.send({ event: "pause" });
    if (!this.state.paused) {
      this.interval.pause();
      this.setState({ paused: !this.state.paused });
    } else if (this.state.paused) {
      this.interval.resume();
      this.setState({ paused: !this.state.paused });
    }
  };
  setLoading = () => {
    this.state.value = 0;
    this.state.paused = true;
    this.interval.pause();
    document.querySelector(".pauseBtn").disabled = true;
    document.querySelector("#progressBar").disabled = true;
  };
  render() {
    if (!this.state.paused) {
      this.interval ? this.interval.resume() : "";
    } else if (this.state.paused) {
      this.interval ? this.interval.pause() : "";
    }
    if (this.state.value > this.state.duration) this.setLoading();
    console.log(this.state)
    return (
      <div>
        <div className="bg-white border-neutral-100 dark:bg-neutral-800 dark:border-neutral-500 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
          <div className="flex items-center space-x-4">
            {this.state.track.coverUrl ? (
              <img
                src={this.state.track.coverUrl}
                alt=""
                width={88}
                height={88}
                className="flex-none rounded-lg bg-transparent"
                loading="lazy"
              />
            ) : (
              <img
                src="https://f4.bcbits.com/img/a4139357031_10.jpg"
                alt=""
                width={88}
                height={88}
                className="flex-none rounded-lg bg-neutral-100"
                loading="lazy"
              />
            )}
            <div className="min-w-0 flex-auto space-y-1 font-semibold">
              <p className="text-black dark:text-white text-sm leading-6">
                {this.state.track.artists?.map((e) => (
                  <span key={e.name}>
                    <a
                      href={e.external_urls.spotify}
                      target="_blank"
                      className="text-green-500 dark:text-green-400 hover:underline"
                    >
                      {e.name}
                    </a>
                    {this.state.track.artists.length - 1 ===
                    this.state.track.artists.findIndex((i) => i.id === e.id)
                      ? ""
                      : ", "}
                  </span>
                ))}
              </p>
              <h2 className="text-neutral-500 dark:text-neutral-400 text-sm leading-6 truncate">
                {this.state.track.albumName === this.state.track.name
                  ? ""
                  : this.state.track.albumName}
              </h2>
              <label
                htmlFor="seek"
                className="text-neutral-900 dark:text-neutral-50 text-lg"
              >
                {this.state.track.name}
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <div className="rounded-full overflow-hidden">
                <ProgressBar state={this.state} />
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
            <button
              type="button"
              aria-label="Add to favorites"
              className="text-neutral-500 dark:text-neutral-200"
            >
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
            disabled={!this.state.playing ? true : false}
          >
            {this.state.paused ? (
              <i className="fa-solid fa-play text-3xl -mr-1"></i>
            ) : (
              <i className="fa-duotone fa-pause text-4xl"></i>
            )}
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

class ProgressBar extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.updateProgressBar();
  }
  handleChange = (event) => {
    if (!this.props.state.playing || document.querySelector(".pauseBtn").disabled)
      return;
    this.setState({ value: Number(event.target.value) });
  };
  getProgressBarStyle = () => {
    const progressBar = document.querySelector("#progressBar");
    if (progressBar) {
      const max = progressBar.max,
        val = progressBar.value;
      return {
        backgroundSize: (val * 100) / max + "% 100%",
      };
      // jQuery(progressBar).css({
      //   backgroundSize: (val * 100) / max + "% 100%",
      // });
    }
  };
  updateProgressBar = () => {
    jQuery("#progressBar").css(this.getProgressBarStyle());
  };
  render() {
    if (!this.props.state.playing) {
      jQuery("#progressBar").css({ backgroundSize: "0% 100%" });
    } else {
      this.updateProgressBar();
    }
    console.log(this.props)
    return (
      <input
        name="seek"
        id="progressBar"
        type="range"
        min="0"
        max={this.props.state.duration}
        value={this.props.state.value}
        step="1"
        onChange={this.handleChange}
        style={
          !this.props.state.playing
            ? { backgroundSize: "0% 100%" }
            : this.getProgressBarStyle()
        }
        className="w-full h-1.5 outline-none bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
      />
    );
  }
}
