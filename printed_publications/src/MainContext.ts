import React from "react";
import { IUser } from "../types/User";

interface IMainContext {
    user: IUser;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    logout: () => void;
}

export const MainContext = React.createContext<IMainContext>({} as IMainContext)