import { IModel } from "./Service";

export interface IUser extends IModel {
    email: string;
    password: string;
    token?: string;
}