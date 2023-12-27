import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CreateListingButton from './CreateListingsCard';
import { fetchListings, fetchListingDetails } from './fetchListing';

const HostedListingsScreen = ({ token }) => {
  const [listings, setListings] = useState([]);
  const [listingDetails, setListingDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedListings = await fetchListings();
      setListings(fetchedListings);
    };

    fetchData();
  }, [token]);

  const owner = localStorage.getItem('owner');
  const filteredListings = listings.filter((listing) => listing.owner === owner);

  useEffect(() => {
    const fetchDataDetails = async () => {
      const details = await fetchListingDetails(filteredListings);
      setListingDetails(details);
    };

    fetchDataDetails();
  }, [token, listings]);

  console.log(listingDetails);
  const handleEditClick = (listingId) => {
    navigate(`/dashboard/edit-listing/${listingId}`);
  };

  const handleDeleteClick = async (listingId) => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this listing?');

    if (!isConfirmed) {
      return; // If not confirmed, do nothing
    }

    try {
      const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      // Update the listings after deletion
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== listingId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '20px' }}>
      <Typography variant="h4" sx={{ fontFamily: 'Montserrat', fontWeight: '600', margin: '20px 0px' }}>Hosted Listings</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
        {listingDetails.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            onEditClick={() => handleEditClick(listing.id)}
            onDeleteClick={() => handleDeleteClick(listing.id)}
          />
        ))}
        <CreateListingButton></CreateListingButton>
      </Box>
    </Box>
  );
};

export default HostedListingsScreen;
