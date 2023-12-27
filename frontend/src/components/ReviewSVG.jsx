import React from 'react';
import { Typography } from '@mui/material';

function calculateAverageRating (reviews) {
  if (!reviews || reviews.length === 0) {
    return 0; // Return 0 if there are no reviews
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return averageRating.toFixed(1);
}

const ReviewSVG = ({ reviews }) => {
  const averageRating = calculateAverageRating(reviews);

  const starIcon = (
    <span role="img" aria-label="star" style={{ color: 'gold' }}>
      ⭐
    </span>
  );

  return (
    <Typography variant='body3' color='black' sx={{ fontFamily: 'Montserrat', fontWeight: '400', marginTop: '5px' }}>{reviews.length} {reviews.length <= 1 ? 'review' : 'reviews'} ({averageRating} {starIcon})</Typography>
  );
};

export default ReviewSVG;
