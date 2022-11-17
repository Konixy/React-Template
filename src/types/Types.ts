import { APIUser, APIConnection, GuildFeature } from "discord-api-types/v10";

export interface APIResponse {
  success: boolean;
  user?: User;
  botGuilds?: Guild[];
}

export interface LoggingState {
  connected: boolean;
  loading: boolean;
  botGuilds?: Guild[];
}

export interface Guild {
  id: string;
  icon: string;
  name: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
  features: GuildFeature[];
}

export interface User extends APIUser {
  connections?: APIConnection[];
  guilds: Guild[];
}

export interface WSResponse {
  success: boolean;
  conectionError?: boolean;
  currentTrack?: APITrack;
  seek?: number;
  paused?: boolean;
}

export interface APITrack {
  name: string;
  duration: number;
  url: string;
  id: string;
}
