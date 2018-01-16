const CookieMap: { [key: string]: string } = {};

export type Person = string;

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

const Bhargav = "bhargav";
const Ashima = "ashima";

export function GetPerson(id: number): Person {
  if (id === 1) {
    return Bhargav;
  }
  return Ashima;
}

export function GetId(person: Person): number {
  if (person === Bhargav) {
    return 1;
  }
  return 2;
}
