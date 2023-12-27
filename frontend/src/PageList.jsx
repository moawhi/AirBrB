import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import LandingHeader from './components/LandingHeader';
import HostedListingCreate from './components/HostedListingCreate';
import HostedListingEdit from './components/HostedListingEdit'
import ViewListing from './components/ViewListing';

const PageList = () => {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checktoken = localStorage.getItem('token');
    if (checktoken) {
      setToken(checktoken);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('owner');
    navigate('/');
  }

  const pages = token
    ? [{ label: 'Logout', icon: <LogoutRoundedIcon /> }]
    : [
        { label: 'Register', icon: <HowToRegIcon /> },
        { label: 'Login', icon: <LoginRoundedIcon /> },
      ];

  return (
    <>
      {token ? <Header /> : <LandingHeader />}
      <Routes>
        <Route path="/" element={<LandingPage token={token}/>} />
        <Route path="/register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/login" element={<Login token={token} setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
        <Route path="/dashboard/create-listings" element={<HostedListingCreate />} />
        <Route path="/dashboard/edit-listing/:listingId" element={<HostedListingEdit token={token} />} />
        <Route path="/view-listing/:listingId" element={<ViewListing token={token} />} />
      </Routes>

      <br />
      <br />
      <hr />

      <Box>
        <BottomNavigation
          showLabels
          value={''}
          onChange={(event, newValue) => {
            if (pages[newValue].label === 'Logout') {
              logout();
            } else {
              navigate(`/${pages[newValue].label.toLowerCase()}`);
            }
          }}
        >
          {pages.map((page, idx) => (
            <BottomNavigationAction key={idx} label={page.label} icon={page.icon} />
          ))}
        </BottomNavigation>
      </Box>
      <hr />

      <Footer />

    </>
  );
}

export default PageList;
