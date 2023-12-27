import React from 'react';
import { useNavigate } from 'react-router-dom';
import HostListingsScreen from './HostedListingScreen';
// import HostedListingEdit from './HostedListingEdit';

function Dashboard (props) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token]);

  return (
    <>
      <HostListingsScreen token={props.token}></HostListingsScreen>
    </>
  )
}

export default Dashboard;
