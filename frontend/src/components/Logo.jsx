/* eslint-disable react/react-in-jsx-scope */
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <Button onClick={handleLogoClick}>
      <Box
        component='img'
        alt='airbrb-logo'
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRomeKJsKhVSdskJ4T06mFxvAYgrtopI_RVrltZop5TWm0EK6nyRGs96TdR91aJmIo3Yfg&usqp=CAU"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginRight: '10px',
          width: '47px',
          height: '50px',
        }}
      >
      </Box>
      <Typography variant='h4' sx={{
        color: '#ff3e61',
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
        textTransform: 'none',
      }}>airbrb</Typography>
    </Button>
  )
}

export default Logo;
