export const request = async (url, method) => {
  const access_token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
    });

    return response.json();
  } catch (err) {
    console.error('Error', err);
  }
};
