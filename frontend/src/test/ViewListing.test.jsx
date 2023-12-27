// ViewListing.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import ViewListing from '../components/ViewListing';
import { fetchSingleListingDetails } from '../components/fetchListing';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../components/fetchListing');

describe('ViewListing', () => {
  const mockListingDetails = {
    id: '1',
    title: 'Test Listing',
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
    },
    price: '100',
    thumbnail: 'thumbnail.jpg',
    metadata: {
      propertyType: 'Apartment',
      bathrooms: 2,
      bedrooms: 3,
      amenities: 'Pool, Wi-Fi',
      images: ['image1.jpg', 'image2.jpg'],
    },
    reviews: [{ id: 1, content: 'Great place!' }],
  };

  beforeEach(() => {
    useParams.mockReturnValue({ listingId: '1' });
    fetchSingleListingDetails.mockResolvedValue(mockListingDetails);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('initially displays a loading message', async () => {
    render(<ViewListing />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays listing details after successful data fetch', async () => {
    render(<ViewListing />);
    await waitFor(() => {
      expect(screen.getByText(mockListingDetails.title)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${mockListingDetails.metadata.bedrooms} bedrooms - ${mockListingDetails.metadata.bedrooms} beds - ${mockListingDetails.metadata.bathrooms} bathrooms:`,
        ),
      ).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /thumbnail/i })).toHaveAttribute('src', mockListingDetails.thumbnail);
    });
  });

  test('renders images correctly when listing has images', async () => {
    render(<ViewListing />);
    await waitFor(() => {
      mockListingDetails.metadata.images.forEach((image, index) => {
        expect(screen.getByRole('img', { name: `Property image ${index}` })).toHaveAttribute('src', image);
      });
    });
  });

  test('handles no images scenario gracefully', async () => {
    fetchSingleListingDetails.mockResolvedValue({
      ...mockListingDetails,
      metadata: { ...mockListingDetails.metadata, images: [] },
    });
    render(<ViewListing />);
    await waitFor(() => {
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  test('displays correct address details from the listing', async () => {
    render(<ViewListing />);
    await waitFor(() => {
      const fullAddress = `${mockListingDetails.metadata.propertyType} in ${mockListingDetails.address.street}, ${mockListingDetails.address.city}, ${mockListingDetails.address.state}`;
      expect(screen.getByText(fullAddress)).toBeInTheDocument();
    });
  });

  test('renders BookingDatePicker with correct price prop', async () => {
    render(<ViewListing />);
    await waitFor(() => {
      // Update this line to match the actual text rendered by your BookingDatePicker component
      expect(screen.getByText(/\$100\.00 AUD total/i)).toBeInTheDocument();
    });
  });
});
