import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, TextField, Typography, Button } from '@mui/material';

function Login (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.token) {
      navigate('/dashboard');
    }
  }, [props.token]);

  const login = async () => {
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('owner', email);
      props.setToken(data.token);
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        padding: '20px',
        textAlign: 'center',
        marginTop: '20px',
        alignContent: 'center',
      }}
    >
      <Typography variant="h4" sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
        Welcome back
      </Typography>
      <br />
      <TextField label="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <br />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      {error && <Typography color="error">{error}</Typography>}
      <br />
      <Button variant="contained" onClick={login} sx={{ background: '#ff3e61' }}>
        Login
      </Button>
    </Box>
  );
}

export default Login;
