export const fetchListings = async () => {
  try {
    const response = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    const data = await response.json();
    return data.listings;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const fetchListingDetails = async (listings) => {
  const details = await Promise.all(
    listings.map(async (listing) => {
      try {
        const response = await fetch(`http://localhost:5005/listings/${listing.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listing details');
        }

        const data = await response.json();
        const listingDetailWithId = { ...data.listing, id: listing.id };
        return listingDetailWithId;
      } catch (error) {
        console.error(error.message);
        return null;
      }
    })
  );

  return details;
};

export const fetchSingleListingDetails = async (listingId) => {
  try {
    const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listing details');
    }

    const data = await response.json();
    return { ...data.listing, id: listingId };
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
