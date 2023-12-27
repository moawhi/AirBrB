import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, InputLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import { fetchListingDetails } from './fetchListing';

const HostedListingEdit = ({ token }) => {
  const { listingId } = useParams();
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

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listing details');
        }

        const data = await response.json();
        setFormData({
          title: data.listing.title,
          address: { ...data.listing.address },
          price: data.listing.price,
          thumbnail: data.listing.thumbnail,
          metadata: { ...data.listing.metadata },
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchListingDetails();
  }, [listingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith('metadata.')) {
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

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const imageArray = Array.from(files);

      // Use FileReader to encode each image
      const readerArray = imageArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      // Once all images are encoded, update the state by appending to the existing array
      Promise.all(readerArray).then((encodedImages) => {
        setFormData((prevData) => ({
          ...prevData,
          metadata: {
            ...prevData.metadata,
            images: [...prevData.metadata.images, ...encodedImages]
          },
        }));
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => {
      const updatedImages = [...prevData.metadata.images];
      updatedImages.splice(index, 1);
      return {
        ...prevData,
        metadata: {
          ...prevData.metadata,
          images: updatedImages,
        },
      };
    });
  };

  const handleSave = async () => {
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
    console.log(formData);

    try {
      const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Successfully updated the listing, navigate back to the hosted listings screen
        navigate('/dashboard');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update listing');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('An error occurred while updating the listing.', error);
    }
  };

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', marginTop: '20px', alignContent: 'center' }}>
      <Typography variant='h4' sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
        Edit Listing
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        {/* Form fields similar to HostedListingCreate */}
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
          accept="image/*"
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
        <InputLabel htmlFor="images-input">Choose Your Property Images</InputLabel>
        <TextField
          id="images-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          sx={{ width: '100%', mb: 2 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2 }}>
          {formData.metadata.images && formData.metadata.images.map((image, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img src={image} alt={`Image ${index + 1}`} style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
              <Button variant="outlined" onClick={() => handleRemoveImage(index)}>
                Remove
              </Button>
            </div>
          ))}
        </Box>
      </Box>
      <Button
        variant="contained"
        onClick={handleSave}
        sx={{ background: '#ff3e61', marginTop: '10px' }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default HostedListingEdit;
