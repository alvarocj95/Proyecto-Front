import { Like } from "./likes";

export interface LikeResponse {
    like: Like;
}

export interface LikesTotal {
    totalLikes: number
}

export interface LikesResponse {
    likes: Like[];
}