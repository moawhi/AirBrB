import React from 'react';
import { Button, Card } from '@mui/material';
import AddHomeRoundedIcon from '@mui/icons-material/AddHomeRounded';
import { useNavigate } from 'react-router-dom';

const CreateListingButton = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/dashboard/create-listings');
  };

  return (
    <Button onClick={handleButtonClick} variant="contained" sx={{
      height: '410px',
      width: '19%',
      minWidth: '350px',
      borderRadius: '19px',
      fontFamily: 'Montserrat',
      fontWeight: '600',
      background: 'none',
      padding: '0px',
      overflow: 'hidden',
      border: '2px solid #ccc',
      transition: 'border-color 0.3s',
      '&:hover': {
        borderColor: '#ff3e61',
      },
    }}>
      <Card sx={{
        height: '100%',
        width: '100%',
        borderRadius: '19px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <AddHomeRoundedIcon sx={{
          padding: '35% 0',
          fontSize: '5rem',
        }}></AddHomeRoundedIcon>
        CREATE LISTINGS
      </Card>
    </Button>

  );
};

export default CreateListingButton;
