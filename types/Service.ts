import { Types } from 'mongoose'
import { IUser, Role } from './User';

export type Id = Types.ObjectId | string;

export interface IModel {
    _id?: Id;
    id: Id;
}