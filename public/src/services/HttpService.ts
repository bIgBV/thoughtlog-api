import { Person } from "../components/Editor";
import { GetId } from "./UserService";

interface APIResponse<T> {
  data: T[];
  status_code: number;
}

export interface ErrorResponse {
  status_code: number;
  status: string;
  error: string;
  code?: string;
}

export interface UserResponse {
  status_code: number;
  id: number;
  created_at: string;
  updated_at: string;
  email: string;
  token: {
    id: number;
    token: string;
  };
}

export interface Post {
  status_code: number;
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  created_by: number;
}

export interface PostResponse extends APIResponse<Post> {}

/* tslint:disable */
export function IsErrResp(object: any): object is ErrorResponse {
  return "error" in object;
}

export function IsUserResp(object: any): object is UserResponse {
  return object.status_code === 202;
}

export function IsPostResp(object: any): object is PostResponse {
  return object.status_code === 201;
}
/* tslint:enable */

/**
 * Given a username and password, AuthLogin queries the authentication endpoint
 *
 * @param name name of the user
 * @param password Password of the user
 */
export function AuthLogin(
  name: string,
  password: string
): Promise<ErrorResponse | UserResponse> {
  return fetch("http://localhost:3001/auth/login", {
    body: JSON.stringify({
      name,
      password
    }),
    method: "POST"
  }).then(response => response.json());
}

/**
 * CreatePost persists the post to the database
 *
 * @param body Body of the post
 * @param createdBy The user creating the post
 */
export function CreatePost(
  body: string,
  createdBy: Person,
  timestamp: string,
  token: string
): Promise<ErrorResponse | PostResponse> {
  const convertedTimestamp = new Date(parseInt(timestamp, 10));
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const localISOOffset = new Date(
    convertedTimestamp.getTime() - tzOffset
  ).toISOString();

  return fetch("http://localhost:3001/api/post/1983718391", {
    body: JSON.stringify({
      body,
      created_at: localISOOffset,
      created_by: GetId(createdBy)
    }),
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: "POST"
  }).then(response => response.json());
}

export function GetPost(
  timestamp: string,
  createdBy: Person,
  token: string
): Promise<PostResponse | ErrorResponse> {
  const convertedTimestamp = Math.floor(parseInt(timestamp, 10) / 1000);

  return fetch(
    `http://localhost:3001/api/post/${convertedTimestamp}?user=${GetId(createdBy)}`,
    {
      body: undefined,
      headers: {
        Authorization: `Bearer: ${token}`
      },
      method: "GET"
    }
  ).then(response => response.json());
}
