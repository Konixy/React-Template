import React, { Component, useEffect, useState } from "react";
import moment from "moment";
import { IntervalTimer } from "./Util";
import { Oval } from "react-loader-spinner";
import jQuery from "jquery";
import WebSocketPlayer from "./WebSocketPlayer";
import config from "./config";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import { codeStyle } from "./Util";

import { useUser } from "./User.context";
import { WSResponse } from "./types/Types";
import { SimplifiedArtistObject } from "spotify-api-types";

const Spotify = new SpotifyWebApi({
  clientId: config.spotifyClientId,
  clientSecret: config.spotifyClientSecret,
  accessToken: config.spotifyToken,
});

interface State {
  value: number;
  duration: number;
  paused: boolean;
  playing: boolean;
  serverId: string;
}

interface CurrentTrack {
  name: string;
  albumName: string | JSX.Element;
  artists: SimplifiedArtistObject[];
  coverUrl: string | null;
  url: string | null;
  id: string | null;
  fetchId: string | null;
}

export default function Player() {
  let interval: IntervalTimer | undefined;
  let ws: WebSocketPlayer;
  const [state, setState] = useState<State>({
    value: 0,
    duration: 0,
    paused: true,
    playing: false,
    serverId: config.localDevServerId,
  });
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack>({
    name: "Chargement...",
    albumName: "",
    artists: [],
    coverUrl: null,
    url: null,
    id: null,
    fetchId: null,
  });
  const { user } = useUser();

  function updateState() {
    interval = new IntervalTimer(
      "seekInterval",
      () => {
        state.value + 1000;
        setState(state);
      },
      1000
    );
    interval.start();
  }

  async function updateInfo(data: WSResponse) {
    if (!data.success) {
      if (data.conectionError) {
        currentTrack.name = "Connexion perdu";
        currentTrack.albumName = (
          <>Veuillez verifier votre connexion internet</>
        );
      } else {
        currentTrack.name = "Aucune musique en cours";
        currentTrack.albumName = (
          <>
            Tapez <code className={codeStyle}>/play</code> pour commencer a
            écouter
          </>
        );
      }
      state.playing = false;
      state.paused = true;
      return setState(state);
    }
    if (data.currentTrack?.duration)
      state.duration = Math.floor(data.currentTrack.duration);
    else state.duration = 0;
    if (data.seek) {
      const splited = `${data.seek}`.split("");
      const nbr = Number(splited.splice(splited.length - 3).join(""));
      state.value = data.seek;
      if (!state.paused) {
        interval?.stop();
        setTimeout(() => {
          interval?.start();
        }, nbr);
      }
    } else state.value = 0;
    if (data.currentTrack?.id) {
      currentTrack.id = data.currentTrack.id;
      currentTrack.url = data.currentTrack.url;
      currentTrack.name = data.currentTrack.name;
      state.playing = true;
      if (!data.paused) {
        interval?.pause();
      } else if (data.paused) {
        interval?.resume();
      }
      // console.log(data.currentTrack.id)
      if (currentTrack.fetchId !== currentTrack.id) {
        Spotify.getTrack(data.currentTrack.id)
          .then((r) => {
            currentTrack.fetchId = r.body.id;
            currentTrack.albumName = r.body.album.name;
            currentTrack.artists = r.body.artists || [];
            currentTrack.coverUrl = r.body.album.images.filter((e) =>
              e.width ? e.width >= 300 && e.width <= 400 : null
            )[0].url;
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    } else {
      currentTrack.name = "Aucune musique en cours";
      currentTrack.albumName = (
        <>
          Tapez <code className={codeStyle}>/play</code> pour commencer a
          écouter
        </>
      );
      state.playing = false;
    }
    state.paused = data.paused ? data.paused : true;
    setState(state);
  }

  function setUpWs() {
    ws = new WebSocketPlayer(
      state.serverId,
      (msg) => {
        const data = JSON.parse(msg.data);
        updateInfo(data);
      },
      (err) => {
        updateInfo({ success: false, conectionError: true });
        setTimeout(() => {
          setUpWs();
        }, 2500);
      }
    );
    ws.init();
  }

  useEffect(() => {
    updateState();
    setUpWs();
    return () => ws?.destroy();
  }, []);

  function pause() {
    const pauseBtn = document.querySelector(".pauseBtn") as HTMLButtonElement;
    if (!state.playing || pauseBtn?.disabled) return;
    ws?.send({ event: "pause" });
  }
  function previous() {
    const pauseBtn = document.querySelector(".pauseBtn") as HTMLButtonElement;
    if (!state.playing || pauseBtn?.disabled) return;
    console.log("previous btn clicked");
    ws.send({ event: "previous" });
  }
  function setLoading() {
    state.value = 0;
    state.paused = true;
    interval?.pause();
    (document.querySelector(".pauseBtn") as HTMLButtonElement).disabled = true;
    (document.querySelector("#progressBar") as HTMLButtonElement).disabled =
      true;
    setState(state);
  }

  useEffect(() => {}, [interval, state]);

  if (!state.paused) interval?.resume();
  else if (state.paused) interval?.pause();

  return (
    <div>
      <div className="bg-white border-neutral-100 dark:bg-neutral-800 dark:border-neutral-500 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
        <div className="flex items-center space-x-4">
          <img
            src={
              currentTrack.coverUrl
                ? currentTrack.coverUrl
                : "https://f4.bcbits.com/img/a4139357031_10.jpg"
            }
            alt=""
            width={88}
            height={88}
            className={[
              "flex-none rounded-lg",
              currentTrack.coverUrl ? "bg-transparent" : "bg-neutral-100",
            ].join(" ")}
            loading="lazy"
          />
          <div className="min-w-0 flex-auto space-y-1 font-semibold">
            <p className="text-black dark:text-white text-sm leading-6">
              {currentTrack.artists?.map((e) => (
                <span key={e.name}>
                  <a
                    href={e.external_urls.spotify}
                    target="_blank"
                    className="text-green-500 dark:text-green-400 hover:underline"
                  >
                    {e.name}
                  </a>
                  {currentTrack.artists.length - 1 ===
                  currentTrack.artists.findIndex((i) => i.id === e.id)
                    ? ""
                    : ", "}
                </span>
              ))}
            </p>
            <h2 className="text-neutral-500 dark:text-neutral-400 text-sm leading-6 truncate">
              {currentTrack.albumName === currentTrack.name
                ? ""
                : currentTrack.albumName}
            </h2>
            <label
              htmlFor="seek"
              className="text-neutral-900 dark:text-neutral-50 text-lg"
            >
              {currentTrack.name}
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <div className="rounded-full overflow-hidden">
              <ProgressBar originalState={state} />
            </div>
          </div>
          <div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
            <div className="text-green-500 dark:text-neutral-100">
              {moment(state.value).format("mm[:]ss")}
            </div>
            <div className="text-neutral-500 dark:text-neutral-400">
              {moment(state.duration).format("mm[:]ss")}
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
          <button type="button" aria-label="Previous" onClick={previous}>
            <i className="fa-solid fa-backward-step text-neutral-500 dark:text-neutral-200 text-xl"></i>
          </button>
        </div>
        <button
          type="button"
          className="pauseBtn disabled:bg-neutral-200 dark:disabled:bg-neutral-400 bg-white text-neutral-900 dark:bg-neutral-100 dark:text-neutral-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-neutral-900/5 shadow-md flex items-center justify-center"
          aria-label="Pause"
          onClick={pause}
          disabled={!state.playing ? true : false}
        >
          {state.paused ? (
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

function ProgressBar({ originalState }: { originalState: State }) {
  const [state, setState] = useState(originalState);
  useEffect(() => {
    updateProgressBar();
  }, []);
  function handleChange(event: { target: { value: any } }) {
    if (
      !state.playing ||
      (document.querySelector(".pauseBtn") as HTMLButtonElement).disabled
    )
      return;
    state.value = Number(event.target.value);
    setState(state);
  }
  function getProgressBarStyle() {
    const progressBar = document.querySelector(
      "#progressBar"
    ) as HTMLInputElement;
    if (progressBar) {
      const max = Number(progressBar.max);
      const val = Number(progressBar.value);
      return {
        backgroundSize: (val * 100) / max + 0.3 + "% 100%",
      };
    }
  }
  function updateProgressBar() {
    const progressBar = document.querySelector(
      "#progressBar"
    ) as HTMLInputElement;
    if (progressBar) {
      const max = Number(progressBar.max);
      const val = Number(progressBar.value);
      return jQuery("#progressBar").css({
        backgroundSize: (val * 100) / max + "% 100%",
      });
    }
  }
  if (!state.playing) {
    jQuery("#progressBar").css({ backgroundSize: "0% 100%" });
  } else {
    updateProgressBar();
  }
  return (
    <input
      name="seek"
      id="progressBar"
      type="range"
      min="0"
      max={state.duration}
      value={state.value}
      step="1"
      onChange={handleChange}
      style={
        !state.playing ? { backgroundSize: "0% 100%" } : getProgressBarStyle()
      }
      className="w-full h-1.5 outline-none bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
    />
  );
}
