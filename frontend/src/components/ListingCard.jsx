import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import WifiTetheringRoundedIcon from '@mui/icons-material/WifiTetheringRounded';
import PortableWifiOffRoundedIcon from '@mui/icons-material/PortableWifiOffRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import ShowerRoundedIcon from '@mui/icons-material/ShowerRounded';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import PublishDatePicker from './PublishDatePicker';
import ReviewSVG from './ReviewSVG';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const ListingCard = ({ data, onEditClick, onDeleteClick }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [rerenderFlag, setRerenderFlag] = useState(false);
  const token = localStorage.getItem('token');
  const location = useLocation();
  const isLandingPage = ['/'].includes(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    // Update the state when data.published changes
    setRerenderFlag((prev) => !prev);
  }, [data.published]);

  const handleAvailabilityClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleSaveDateRange = (newDateRange) => {
    // Append the new date range to the existing selectedDateRange
    console.log('save date range', newDateRange);
    console.log('check date range', selectedDateRange);
    setSelectedDateRange([...selectedDateRange, newDateRange]);
    setShowDatePicker(false);
  };

  const handlePublishClick = async () => {
    if (selectedDateRange) {
      const listingId = data.id;
      const apiUrl = `http://localhost:5005/listings/publish/${listingId}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availability: selectedDateRange,
          }),
        });

        if (response.ok) {
          // Listing published successfully, show notification
          toast.success('Listing published successfully', { position: toast.POSITION.TOP_CENTER });
          navigate('/');
        } else {
          throw new Error('Invalid input');
        }
      } catch (error) {
        console.error('Error publishing listing:', error.message);
      }
    } else {
      alert('Please select an availability');
    }
  };

  const formattedDates = data?.availability?.map((dateString) => {
    const startDate = new Date(dateString.startDate);
    const endDate = new Date(dateString.endDate);
    endDate.setDate(endDate.getDate() + 1); // Increment by 1 day to get the end date

    const formattedStartDate = startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const formattedEndDate = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    return `${formattedStartDate} - ${formattedEndDate}`;
  });

  const handleUnpublishClick = async () => {
    const listingId = data.id;
    const apiUrl = `http://localhost:5005/listings/unpublish/${listingId}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Listing unpublished successfully, show notification
        toast.success('Listing unpublished successfully', { position: toast.POSITION.TOP_CENTER });
        navigate('/');
      } else {
        throw new Error('Invalid input');
      }
    } catch (error) {
      console.error('Error unpublishing listing:', error.message);
    }
  };

  return (
    <Box
      key={rerenderFlag}
      variant="contained"
      sx={{
        height: '410px',
        width: '19%',
        minWidth: '350px',
        borderRadius: '19px',
        padding: '0px',
        overflow: 'hidden',
        textTransform: 'none',
        border: '2px solid #ccc',
        transition: 'border-color 0.3s',
        '&:hover': { borderColor: '#ff3e61' },
      }}
    >
      <ToastContainer />
      <Card
        sx={{
          height: '100%',
          width: '100%',
          minWidth: '300px',
          borderRadius: '15px',
          fontFamily: 'Montserrat',
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Montserrat',
                fontWeight: '600',
              }}
            >
              {' '}
              {data.title}{' '}
            </Typography>
          }
          subheader={
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Montserrat',
              }}
            >
              {`${data.address.street}, ${data.address.city}, ${data.address.state}, ${data.address.postcode}, ${data.address.country}`}
            </Typography>
          }
          sx={{ color: 'black', height: '70px', padding: '10px 15px' }}
        />

        {!showDatePicker && (
          <CardMedia component="img" height="194" image={data.thumbnail || 'default-thumbnail.jpg'} alt={data.title} />
        )}
        <CardContent sx={{ padding: '10px 15px' }}>
          <Typography
            variant="body2"
            color="black"
            sx={{
              height: '43px',
              fontFamily: 'Montserrat',
              fontWeight: '450',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{`$${data.price} per night`}</span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {` ${data.metadata.bedrooms} `} <HotelRoundedIcon sx={{ color: '#757575', padding: '0 10px 0 5px' }} />
              {` ${data.metadata.bathrooms} `} <ShowerRoundedIcon sx={{ color: '#757575', padding: '0 -1px' }} />
            </span>
          </Typography>
        </CardContent>
        {!isLandingPage && (
          <CardActions disableSpacing>
            <Tooltip title="Add Availability" arrow>
              <IconButton aria-label="share" onClick={handleAvailabilityClick}>
                <EventAvailableRoundedIcon />
              </IconButton>
            </Tooltip>
            {!data.published && (
              <Tooltip title="Publish" arrow>
                <IconButton aria-label="share" onClick={handlePublishClick} sx={{ color: '#ff3e61' }}>
                  <WifiTetheringRoundedIcon />
                </IconButton>
              </Tooltip>
            )}

            {data.published && (
              <>
                <Tooltip title="Unpublish" arrow>
                  <IconButton aria-label="share" onClick={handleUnpublishClick} sx={{ color: '#ff3e61' }}>
                    <PortableWifiOffRoundedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Manage requests" arrow>
                  <IconButton
                    aria-label="share"
                    component={Link}
                    to={`/view-listing/${data.id}`}
                    sx={{ color: '#ff3e61' }}
                  >
                    <UpcomingIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title="Edit Listing" arrow>
              <IconButton aria-label="edit" onClick={() => onEditClick(data.id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Listing" arrow>
              <IconButton aria-label="delete" onClick={() => onDeleteClick(data.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        )}
        {isLandingPage && (
          <Box sx={{ margin: '0px 15px' }}>
            <Typography variant="body2" color="black" sx={{ fontFamily: 'Montserrat' }}>
              {formattedDates[0]}
            </Typography>
            <ReviewSVG reviews={data.reviews}></ReviewSVG>
          </Box>
        )}
        {showDatePicker && (
          <Box sx={{ margin: '0px 15px' }}>
            <PublishDatePicker onSave={handleSaveDateRange} />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ListingCard;
