import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CommonSearchBar from '../common/CommonSearchBar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SearchBar = ({ listings, setListing }) => {
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minBedrooms, setMinBedrooms] = useState('');
  const [maxBedrooms, setMaxBedrooms] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [changeSortOrder, setChangeSortOrder] = useState(false);

  const hasFilters = () => {
    return searchInput || minBedrooms || maxBedrooms || startDate || endDate || minPrice || maxPrice || changeSortOrder;
  };

  // helper function
  const constructFullAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.postcode}, ${address.country}`;
  };

  const handleSearch = () => {
    const filterData = {
      searchInput,
      minBedrooms,
      maxBedrooms,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      minPrice,
      maxPrice,
      sortOrder,
    };
    console.log(filterData);
    let filteredListings = [...listings];
    // Filter by search input (semi case-sensitive match)
    if (searchInput) {
      filteredListings = filteredListings.filter(
        (item) =>
          item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          constructFullAddress(item.address).toLowerCase().includes(searchInput.toLowerCase()),
      );
    }

    // Filter by number of bedrooms
    if (minBedrooms) {
      filteredListings = filteredListings.filter((item) => parseInt(item.metadata.bedrooms) >= parseInt(minBedrooms));
    }
    if (maxBedrooms) {
      filteredListings = filteredListings.filter((item) => parseInt(item.metadata.bedrooms) <= parseInt(maxBedrooms));
    }

    // Filter by date range
    if (startDate) {
      filteredListings = filteredListings.filter((item) =>
        item.availability?.some(
          (dateRange) =>
            dayjs(dateRange.startDate).isSame(startDate, 'day') || dayjs(dateRange.startDate).isBefore(startDate),
        ),
      );
    }
    if (endDate) {
      filteredListings = filteredListings.filter((item) =>
        item.availability?.some(
          (dateRange) => dayjs(dateRange.endDate).isSame(endDate, 'day') || dayjs(dateRange.endDate).isBefore(endDate),
        ),
      );
    }
    // if (endDate) {
    //   filteredListings = filteredListings.filter((item) =>
    //     Date(item.availability?.filter((range) => dayjs(range.endDate) >= endDate)),
    //   );
    // }

    // Filter by price range
    filteredListings = filteredListings.filter(
      (item) =>
        (minPrice === null || minPrice === '' || parseFloat(item.price) >= parseFloat(minPrice)) &&
        (maxPrice === null || maxPrice === '' || parseFloat(item.price) <= parseFloat(maxPrice)),
    );

    // Sort by reviews
    // TODO: Test this
    filteredListings = filteredListings.sort((a, b) =>
      sortOrder === 'desc' ? b.reviews - a.reviews : a.reviews - b.reviews,
    );

    console.log(filteredListings);
    setListing(filteredListings);
  };

  const toggleFilterSection = () => {
    setShowFilters(!showFilters);
  };

  const handleReset = () => {
    setSearchInput('');
    setMinBedrooms('');
    setMaxBedrooms('');
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
    setSortOrder('desc');
    setChangeSortOrder(false);

    handleSearch();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '30px', width: '80%', fontFamily: 'Montserrat' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '20px',
          paddingRight: '20px',
          height: '65px',
          width: '100%',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <CommonSearchBar
          placeholder="Search by title and address"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ width: '80%', flex: '1', color: 'rgba(0, 0, 0, 0.6)', fontSize: '1.1rem', fontFamily: 'Montserrat' }}
        />

        {/* Reset button with icon */}
        {hasFilters() && (
          <IconButton
            color="primary"
            onClick={handleReset}
            sx={{
              marginBottom: '10px',
              textAlign: 'center',
              justifyContent: 'flex-end',
              fontSize: '1.05rem',
              color: '#ff2d55',
            }}
          >
            <RefreshIcon />
          </IconButton>
        )}

        <IconButton
          data-testid="filterToggleButton"
          onClick={toggleFilterSection}
          size="large"
          sx={{
            marginBottom: '10px',
            textAlign: 'center',
            justifyContent: 'flex-end',
            fontSize: '1.05rem',
            color: showFilters ? '#ff2d55' : '#757575',
            fontFamily: 'Montserrat'
          }}
        >
          <FilterListIcon />
        </IconButton>

        <Button
          variant="contained"
          onClick={handleSearch}
          // size="large"
          sx={{
            marginBottom: '10px',
            textAlign: 'center',
            justifyContent: 'flex-end',
            fontSize: '1.05rem',
            backgroundColor: '#ff2d55',
          }}
        >
          Search
        </Button>
      </Box>

      {showFilters && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '20px',
              width: '100%',
              justifyContent: 'space-between',
              paddingLeft: '20px',
              paddingRight: '20px',
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            {/* Number of Bedrooms */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                minWidth: '200px',
              }}
            >
              <Typography variant="body1" sx={{ margin: '10px', fontFamily: 'Montserrat' }}>
                Number of Bedrooms:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <TextField
                  label="Min Bedrooms"
                  inputMode="mumeric"
                  variant="outlined"
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(e.target.value.replace(/\D/g, ''))}
                  sx={{ flex: '1', marginRight: '10px' }}
                />
                <TextField
                  label="Max Bedrooms"
                  variant="outlined"
                  inputMode="mumeric"
                  value={maxBedrooms}
                  onChange={(e) => setMaxBedrooms(e.target.value.replace(/\D/g, ''))}
                  sx={{ flex: '1', marginRight: '10px' }}
                />
              </Box>
            </Box>

            {/* Date Range */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '200px' }}>
              <Typography variant="body1" sx={{ margin: '10px', fontFamily: 'Montserrat' }}>
                Date Range:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <DatePicker
                  label="Start Date"
                  inputFormat="yyyy-MM-dd"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  sx={{ flex: '1', marginRight: '10px' }}
                />
                <DatePicker
                  label="End Date"
                  inputFormat="yyyy-MM-dd"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  sx={{ flex: '1', marginRight: '10px' }}
                />
              </Box>
            </Box>

            {/* Price Range */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '200px' }}>
              <Typography variant="body1" sx={{ margin: '10px', fontFamily: 'Montserrat' }}>
                Price Range:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <TextField
                  label="Min Price"
                  variant="outlined"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
                  sx={{ flex: '1', marginRight: '10px', fontFamily: 'Montserrat' }}
                />
                <TextField
                  label="Max Price"
                  variant="outlined"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                  sx={{ flex: '1', marginRight: '10px', fontFamily: 'Montserrat' }}
                />
              </Box>
            </Box>

            {/* Review Ratings */}
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
              <Typography variant="body1" sx={{ margin: '10px', fontFamily: 'Montserrat' }}>
                Sort by Rating:
              </Typography>
              <Select
                value={sortOrder}
                onChange={(e) => {
                  setChangeSortOrder(true);
                  setSortOrder(e.target.value);
                }}
                variant="outlined"
                sx={{ width: '100%', marginBottom: '10px' }}
              >
                <MenuItem value="desc">High to Low</MenuItem>
                <MenuItem value="asc">Low to High</MenuItem>
              </Select>
            </Box>
          </Box>
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default SearchBar;
