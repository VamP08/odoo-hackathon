export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('rewear_token');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    }
  });
};
