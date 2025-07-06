import { BASE_URL } from '../constants.jsx';

export function isAuthorized() {
  return localStorage.getItem('loginData') !== null;
}

export async function refreshToken() {
  const userData = localStorage.getItem('loginData');
  if (!userData) {
    return 'error';
  }

  try {
    const parsedData = JSON.parse(userData);
    if (!parsedData.refresh) {
      return 'error';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        refresh: parsedData.refresh,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return 'error';
    }

    const data = await response.json();
    if (!data.access || !data.refresh) {
      return 'error';
    }

    parsedData.access = data.access;
    parsedData.refresh = data.refresh;
    localStorage.setItem('loginData', JSON.stringify(parsedData));
    return 'success';
  } catch (error) {
    console.error('Error refreshing token:', error);
    return 'error';
  }
}