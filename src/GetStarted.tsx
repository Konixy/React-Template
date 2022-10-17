import axios, { AxiosResponse } from "axios";
import React, { Component, useState, useEffect } from "react";
import config from "./config";
import { APIUser, APIConnection, GuildFeature } from "discord-api-types/v10";

interface LoggingState {
  connected: boolean;
  loading: boolean;
  botGuilds: DiscordGuild[] | null
}

interface DiscordGuild {
  id: string;
  icon: string;
  name: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
  features: GuildFeature[];
}

interface DiscordUser extends APIUser {
  connections?: APIConnection[];
  guilds: DiscordGuild[];
}

export default function getStarted() {
  const [state, setState] = useState<LoggingState>({
    loading: true,
    connected: false,
    botGuilds: null
  });
  const [user, setUser] = useState<DiscordUser | null>(null);
  function init() {
    axios.get(`${config.backendPath}/api/info?withGuilds=true`).then((r: AxiosResponse) => {
      setState({
        connected: r.data.success,
        loading: false,
        botGuilds: null
      });
      setUser(r.data.user ? r.data.user : null);
      console.log(r.data);
    });
  }
  function sortCurrentGuilds(guilds: DiscordGuild[]): DiscordGuild[] {
    return guilds;
  }
  function sortCanBeAddedGuild(guilds: DiscordGuild[]): DiscordGuild[] {
    let sortedGuilds: DiscordGuild[] = [];
    guilds.map((e) =>
      e.permissions
        ? (e.permissions & 0x20) == 0x20 // 0x20 = 'MANAGE_GUILD'
          ? sortedGuilds.push(e)
          : null
        : null
    );
    // renvouyer juste les guild ou le bot est présent
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
          {state.botGuilds ? sortCurrentGuilds(state.botGuilds).map((e) => (
            <div key={e.id}>The bot is in {e.name}</div>
          )) : null}
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
