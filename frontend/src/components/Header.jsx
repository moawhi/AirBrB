/* eslint-disable react/react-in-jsx-scope */

import { Box } from '@mui/material';
import AccountMenu from './AccountMenu';
import Logo from './Logo';

const Header = () => {
  return (
    <Box sx={{
      display: 'flex',
      margin: '20px 10px',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
      <Logo></Logo>
      <AccountMenu>
      </AccountMenu>
    </Box>
  )
}

export default Header;
