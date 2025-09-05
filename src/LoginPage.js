// Update your handleLogin function in LoginPage.js
const handleLogin = async (event) => {
  event.preventDefault();
  setError('');

  const params = new URLSearchParams();
  params.append('username', staffNumber);
  params.append('password', pin);

  try {
    console.log('Attempting login to:', process.env.REACT_APP_API_BASE_URL);
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.data.access_token && response.data.user_data) {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('userData', JSON.stringify(response.data.user_data));
      navigate('/dashboard');
    } else {
      setError('Login Failed: Invalid response from server.');
    }
  } catch (err) {
    console.error('Login error:', err);
    if (err.response) {
      // Server responded with error status
      setError(`Login Failed: ${err.response.data.detail || 'Server error'}`);
    } else if (err.request) {
      // Request was made but no response received
      setError('Login Failed: Cannot connect to server. Please check your connection.');
    } else {
      // Other errors
      setError('Login Failed: An unexpected error occurred.');
    }
  }
};
