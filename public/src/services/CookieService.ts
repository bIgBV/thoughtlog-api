const CookieMap: { [key: string]: string } = {};

export function ReadCookie(name: string): string | undefined {
  if (CookieMap[name]) {
    return CookieMap[name];
  }

  const cookies = document.cookie.split("; ");

  for (let i = cookies.length - 1; i >= 0; i--) {
    const cookie = cookies[i].split("=");
    CookieMap[cookie[0]] = cookie[1];
  }
  return CookieMap[name];
}
