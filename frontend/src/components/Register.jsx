import React from 'react';
import { useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Register (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.token) {
      navigate('/dashboard');
    }
  }, [props.token]);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !name) {
      setError('All fields are required');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    setError('');
    return true;
  };

  const register = async () => {
    if (!validateForm()) {
      return;
    }

    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        name,
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
    <>
      <Box
        sx={{
          padding: '20px',
          textAlign: 'center',
          marginTop: '20px',
          alignContent: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
          Welcome to Airbrb
        </Typography>
        <br />
        <TextField label="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <br />
        <TextField label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <br />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <br />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        {error && <Typography color="error">{error}</Typography>}
        <br />
        <Button variant="contained" onClick={register} sx={{ background: '#ff3e61' }}>
          Register
        </Button>
      </Box>
    </>
  );
}

export default Register;
