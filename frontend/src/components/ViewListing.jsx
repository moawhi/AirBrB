import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Button, Typography, Divider, ImageList, ImageListItem, CircularProgress, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { fetchSingleListingDetails } from './fetchListing';
import BookingDatePicker from './BookingDatePicker';
import BookingRequests from './BookingRequests';
import ManageBookings from './ManageBookings';
import ReviewSVG from './ReviewSVG';

const ViewListing = () => {
  const { listingId } = useParams();
  const user = localStorage.getItem('owner');
  const [listingDetails, setListingDetails] = useState(null);
  const [showReviewsTable, setShowReviewsTable] = useState(true);
  const [shouldUpdateReviewSVG, setShouldUpdateReviewSVG] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await fetchSingleListingDetails(listingId);
      setListingDetails(details);
    };

    fetchDetails();
  }, [listingId, shouldUpdateReviewSVG]);

  if (!listingDetails) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  const {
    title,
    owner,
    address,
    price,
    thumbnail,
    metadata: {
      propertyType,
      bathrooms,
      bedrooms,
      amenities,
      images,
    },
    reviews,
    // availability,
    // published,
  } = listingDetails;

  const isOwner = (user === owner);
  const handleShowReviewsTable = () => {
    setShowReviewsTable(!showReviewsTable);
  };

  return (
    <Box sx={{ padding: '20px', textAlign: 'left', marginTop: '20px', alignContent: 'center' }}>
      <Typography variant="h4" sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
        {title}
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: '20px'
      }}>
        <Box sx={{
          width: '45%',
          height: '50%',
          minWidth: '350px',
          marginTop: '16px',
        }}>
          <img
            src={thumbnail}
            alt="Thumbnail"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        {images && (<ImageList sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          minWidth: '350px',
          width: '50%',
          columnGap: '10px'
        }}>
          {images.map((item, index) => (
            <ImageListItem key={index} sx={{
              width: '48%', // Half of the thumbnail size
              height: '50%',
            }}>
              <img
                src={item}
                alt={`Property image ${index}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  minWidth: '173px', // Half of the minimum thumbnail size
                  minHeight: '175px', // Half of the minimum thumbnail size
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
        )}

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '12px',
          minWidth: '350px',
          flexWrap: 'wrap',
        }}>
          <Box sx={{ width: '100%', height: 'auto', minWidth: '350px' }}>
            <Typography variant="h5" sx={{ fontFamily: 'Montserrat', fontWeight: '600', color: 'black' }}>
              {propertyType} in {address.street}, {address.city}, {address.state}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Montserrat' }}>
              {bedrooms} bedrooms - {bedrooms} beds - {bathrooms} bathrooms:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Montserrat' }}>
              Amenities: {amenities}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleShowReviewsTable}
              sx={{ border: 'none' }}
            >
              <ReviewSVG key={shouldUpdateReviewSVG} reviews={reviews} />
            </Button>
            {showReviewsTable && (
              <TableContainer sx={{ marginTop: '10px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rating</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviews
                      .sort((a, b) => b.rating - a.rating)
                      .map((review, index) => (
                        <TableRow key={index}>
                          <TableCell>{review.rating}</TableCell>
                          <TableCell>{review.comment}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>)}
            <br />
            <Divider sx={{ mx: '20px' }} />
            <br />
          </Box>
          {!isOwner && (
            <Box sx={{ width: '100%', minWidth: '350px' }}>
              <BookingDatePicker price={price} />
            </Box>
          )}
          {isOwner && (
            <Box sx={{ width: '100%', minWidth: '350px' }}>
              <BookingRequests listingDetail={listingDetails}></BookingRequests>
            </Box>
          )}
        </Box>
      </Box>
      {!isOwner && (
        <ManageBookings setShouldUpdateReviewSVG={setShouldUpdateReviewSVG}></ManageBookings>
      )}

    </Box>
  );
};

export default ViewListing;
