import { Avatar } from "./avatar";

export interface User {
    avatar: Avatar; 
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}