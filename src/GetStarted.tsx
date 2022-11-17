import axios, { AxiosResponse } from "axios";
import React, { Component, useState, useEffect } from "react";
import config from "./config";
import { User, Guild, LoggingState, APIResponse } from "./types/Types";
import { useUser } from "./User.context";

export default function getStarted() {
  const [state, setState] = useState<LoggingState>({
    loading: true,
    connected: false,
  });
  const {user, setUser} = useUser();
  function init() {
    axios
      .get(`${config.backendPath}/api/info?withGuilds=true`)
      .then((r: AxiosResponse<APIResponse>) => {
        setState({
          connected: r.data.success,
          loading: false,
        });
        setUser(r.data.user ? r.data.user : null);
        console.log(r.data);
      });
  }
  function sortCurrentGuilds(guilds: Guild[]): Guild[] {
    return guilds;
  }
  function sortCanBeAddedGuild(guilds: Guild[]): Guild[] {
    let sortedGuilds: Guild[] = [];
    guilds.map((e) =>
      e.permissions
        ? (e.permissions & 0x20) == 0x20 // 0x20 = 'MANAGE_GUILD'
          ? sortedGuilds.push(e)
          : null
        : null
    );
    // TODO: renvoyer juste les guild ou le bot est présent
    return sortedGuilds;
  }
  useEffect(() => {
    init();
  }, []);
  return (
    <div className="text-black dark:text-white">
      {state.loading ? (
        "Chargement..."
      ) : user ? (
        <div className="flex flex-col">
          {state.botGuilds
            ? sortCurrentGuilds(state.botGuilds).map((e) => (
                <div key={e.id}>The bot is in {e.name}</div>
              ))
            : null}
          {sortCanBeAddedGuild(user.guilds).map((e) => (
            <div key={e.id}>The bot is'nt in {e.name}</div>
          ))}
        </div>
      ) : (
        "Se connecter"
      )}
    </div>
  );
}
