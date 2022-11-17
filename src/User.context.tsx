import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { User } from "./types/Types";

export const UserContext = createContext<{
  setUser: Dispatch<SetStateAction<null | User>>;
  user: null | User;
}>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);
