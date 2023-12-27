import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchListings, fetchListingDetails } from './fetchListing';
import SearchBar from './searchComponent/SearchBar';

const LandingPage = ({ token }) => {
  const owner = localStorage.getItem('owner');
  const [listings, setListings] = useState([]);
  const [listingDetails, setListingDetails] = useState([]);
  const [filteredListing, setFilteredListing] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedListings = await fetchListings();
      setListings(fetchedListings);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataDetails = async () => {
      const details = await fetchListingDetails(listings);
      // Sort the details array by the title property
      details.sort((a, b) => a.title.localeCompare(b.title));
      setListingDetails(details);
    };

    fetchDataDetails();
  }, [listings]);

  // prepare published listing for search and filter
  useEffect(() => {
    const publishedListings = listingDetails.filter((listing) => listing.published);

    setFilteredListing(publishedListings);
  }, [listingDetails]);

  if (listingDetails.length === 0) {
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

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '20px' }}
    >
      {token && (
        <Typography variant="h4" sx={{ fontFamily: 'Montserrat', fontWeight: '600', margin: '20px 0px' }}>
          Welcome back, {owner.split('@')[0]}
        </Typography>
      )}

      {!token && (
        <Typography variant="h4" sx={{ fontFamily: 'Montserrat', fontWeight: '600', margin: '20px 0px' }}>
          Welcome to AirBrB
        </Typography>
      )}

      <SearchBar listings={listingDetails.filter((listing) => listing.published)} setListing={setFilteredListing} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          rowGap: '35px',
          columnGap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {filteredListing.map((listing) => (
          <Button
            key={listing.id}
            component={Link}
            to={`/view-listing/${listing.id}`}
            sx={{
              textAlign: 'left',
              height: '410px',
              width: '19%',
              minWidth: '350px',
            }}
          >
            <ListingCard data={listing} />
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default LandingPage;
