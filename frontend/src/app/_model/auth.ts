import { User } from "./user";

export interface Auth {
    success: string;
    user: User;
    token: string;
}