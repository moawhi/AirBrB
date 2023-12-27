/* eslint-disable react/react-in-jsx-scope */
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Typography
      variant="caption"
      display="block"
      gutterBottom
      sx={{
        textAlign: 'center',
      }}
    >
      © 2023 Airbrb, Inc.
    </Typography>
  )
}

export default Footer;
