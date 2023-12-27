// HostedListingCreate.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HostedListingCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    address: {
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
    },
    price: 0,
    thumbnail: '',
    metadata: {
      propertyType: '',
      bathrooms: 0,
      bedrooms: 0,
      amenities: '',
      images: [],
    },
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      // Handle nested address fields
      const addressField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith('metadata.')) {
      // Handle nested metadata fields
      const metadataField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        metadata: {
          ...prevData.metadata,
          [metadataField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error for the current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleThumbnailChange = (e) => {
    // Handle image upload
    const file = e.target.files[0];
    const inputValue = e.target.value.trim();
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, thumbnail: reader.result }));
      };

      if (file.type.startsWith('image/')) {
        // Handle image upload
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        // Handle video upload
        reader.readAsArrayBuffer(file);
      } else if (inputValue.startsWith('https://www.youtube.com/') || inputValue.startsWith('https://youtu.be/')) {
        setFormData((prevData) => ({ ...prevData, thumbnail: inputValue }));
      } else {
        // Handle other file types if needed
        alert('Unsupported file type');
      }
    }
  };

  const handleSubmit = async () => {
    // Form validation
    const validationErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim() === '') {
        validationErrors[key] = 'This field is required';
      }
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Implement logic to create a new listing
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle the case where the user is not authenticated
      alert('User is not authenticated');
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/listings/new', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.listingId) {
        // Successfully created a new listing, navigate to the hosted listings screen
        navigate('/dashboard');
      } else if (data.error) {
        // Handle other errors
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('An error occurred while creating the listing.', error);
    }
  };

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', marginTop: '20px', alignContent: 'center' }}>
      <Typography variant='h4' sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
        Create New Listing
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        <TextField
          label="Listing Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />
        {/* Address Fields */}
        <TextField
          label="Street"
          type="text"
          name="address.street"
          value={formData.address.street}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />

        <TextField
          label="City"
          type="text"
          name="address.city"
          value={formData.address.city}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />
        <TextField
          label="State"
          type="text"
          name="address.state"
          value={formData.address.state}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />
        <TextField
          label="Postcode"
          type="text"
          name="address.postcode"
          value={formData.address.postcode}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />
        <TextField
          label="Country"
          type="text"
          name="address.country"
          value={formData.address.country}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />

        {/* Rest of the form fields */}
        <TextField
          label="Price (per night)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />
        <InputLabel htmlFor="thumbnail-input">Choose Your Thumbnail</InputLabel>
        <TextField
          id="thumbnail-input"
          type="file"
          accept="image/*, video/*" // Allow both image and video files
          onChange={handleThumbnailChange}
          sx={{ width: '100%', mb: 2 }}
        />
        <TextField
          label="Property Type"
          type="text"
          name="metadata.propertyType"
          value={formData.metadata.propertyType}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />
        <TextField
          label="Number of Bathrooms"
          type="number"
          name="metadata.bathrooms"
          value={formData.metadata.bathrooms}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />
        <TextField
          label="Number of Beds"
          type="text"
          name="metadata.bedrooms"
          value={formData.metadata.bedrooms}
          onChange={handleInputChange}
          error={Boolean(errors.title)}
          helperText={errors.title}
          sx={{ width: '100%', mb: 2 }}
        />
        <TextField
          label="Amenities"
          type="text"
          name="metadata.amenities"
          value={formData.metadata.amenities}
          onChange={handleInputChange}
          sx={{ width: '100%', mb: 2 }}
        />
      </Box>
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ background: '#ff3e61', marginTop: '10px' }}
      >
        Create Listing
      </Button>
    </Box>
  );
};

export default HostedListingCreate;
