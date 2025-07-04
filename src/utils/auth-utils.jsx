import {BASE_URL} from "../constants.jsx";

export function isAuthorized() {
  return localStorage.getItem('loginData') !== null;
}

export async function refreshToken() {
  try {
  const userData = JSON.parse(localStorage.getItem('loginData'));
  const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      refresh: userData.refresh,
    }),
  });
  const data = await response.json();
  userData.access = data.access;
  userData.refresh = data.refresh;
  localStorage.setItem('loginData', JSON.stringify(userData));
  return 'success';
  } catch (e) {
    return e;
  }
}
