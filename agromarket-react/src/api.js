export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = res.status === 204 ? null : await res.json().catch(() => null);

  // Если токен истёк или подделан — очищаем хранилище и перезагружаем
  if (res.status === 401 && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Ошибка ${res.status}`);
    err.details = data?.details || [];
    throw err;
  }
  return data;
}