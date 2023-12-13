import { IModel } from "../types/Service";

export interface IUser extends IModel {
    id?: number;
    username: string;
    password: string;
    token?: string;
}