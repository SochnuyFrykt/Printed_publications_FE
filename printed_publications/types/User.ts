import { IModel } from "../types/Service";

export interface IUser extends IModel {
    id?: number;
    email: string;
    password?: string;
    token?: string;
}