/* eslint-disable react/react-in-jsx-scope */

import { Box } from '@mui/material';
import LandingMenu from './LandingMenu';
import Logo from './Logo';
const LandingHeader = () => {
  return (
    <Box sx={{
      display: 'flex',
      marginTop: '20px',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
      <Logo></Logo>
      <LandingMenu></LandingMenu>
    </Box>
  )
}

export default LandingHeader;
