import { APIUser, APIConnection, GuildFeature } from "discord-api-types/v10";
import { AxiosResponse } from "axios";

export interface Response extends AxiosResponse {
  data: DataResponse
}

export interface DataResponse {
  success: boolean,
  user?: User,
  botGuilds?: Guild[]
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
