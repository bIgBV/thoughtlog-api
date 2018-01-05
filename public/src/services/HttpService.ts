export interface APIResponse {
  status_code: number;
  status: string;
  error: string;
  name?: string;
}

export function AuthLogin(name: string, password: string): Promise<APIResponse> {
  return fetch("http://localhost:3001/auth/login", {
    body: JSON.stringify({
      name,
      password
    }),
    method: "POST"
  }).then(response => response.json());
}
