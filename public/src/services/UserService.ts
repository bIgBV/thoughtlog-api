// @format
const CookieMap: {[key: string]: string} = {};

export type Person = string;

export function ReadCookie(name: string): string | undefined {
  if (CookieMap[name]) {
    return CookieMap[name];
  }

  const cookies = document.cookie.split('; ');

  for (let i = cookies.length - 1; i >= 0; i--) {
    const cookie = cookies[i].split('=');
    CookieMap[cookie[0]] = cookie[1];
  }
  return CookieMap[name];
}

export function SetCookie(name: string, value: string, days?: number) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 2400));
    expires = `; expires=${date.toISOString()}`;
  }

  document.cookie = `${name}=${value || ''};${expires};path=/`;
}

export function DeleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

const Bhargav = 'bhargav';
const Ashima = 'ashima';

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
