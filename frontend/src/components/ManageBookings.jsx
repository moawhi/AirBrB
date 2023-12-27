import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Rating, TextField, Typography, Snackbar, Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { id: 'id', label: 'Booking ID', minWidth: 50, width: 100 },
  { id: 'checkIn', label: 'Check-in', minWidth: 50, width: 170 },
  { id: 'checkOut', label: 'Check-out', minWidth: 50, width: 170 },
  { id: 'status', label: 'Status', minWidth: 50, width: 170 },
  { id: 'rating', label: 'Rating', minWidth: 50, width: 170 },
  { id: 'review', label: 'Review', minWidth: 50, width: 170 },
  { id: 'actions', label: 'Actions', minWidth: 50, width: 100 },
];

const ManageBookings = ({ setShouldUpdateReviewSVG }) => {
  const [page, setPage] = useState(0);
  const { listingId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewValue, setReviewValue] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(false);

  const [, setReviewDetails] = useState({
    rating: 5,
    comment: ''
  });

  const handleReviewChange = (event) => {
    setReviewValue(event.target.value);
    setReviewDetails((prevDetails) => ({
      ...prevDetails,
      comment: event.target.value,
    }));
  };

  useEffect(() => {
    // Fetch bookings from the API
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5005/bookings', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter out bookings with owner not equal to the logged-in user
          const filteredBookings = data.bookings.filter(
            (booking) => (booking.owner === localStorage.getItem('owner') && booking.listingId === listingId)
          );
          setBookings(filteredBookings);
        } else {
          console.error('Failed to fetch bookings:', response.statusText);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };

    fetchBookings();
  }, [deleteBooking]);

  const handleReviewSubmit = async (listingId, bookingId) => {
    console.log(ratingValue, reviewValue);
    try {
      const payload = {
        review: {
          rating: ratingValue,
          comment: reviewValue,
        },
      };

      const response = await fetch(`http://localhost:5005/listings/${listingId}/review/${bookingId}`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`Review for booking ${bookingId} submitted`);
        setReviewSubmitted(true); // Set the state to true after submission
        setShouldUpdateReviewSVG((prev) => !prev);
      } else {
        const errorData = await response.json();
        console.error('Failed to submit review:', errorData);
      }
    } catch (error) {
      console.error('Error during review submission:', error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5005/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (response.ok) {
        console.log(`Booking ${bookingId} deleted`);
        // After successful deletion, update the bookings list
        setShouldUpdateReviewSVG((prev) => !prev);
        setDeleteBooking((prev) => !prev);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete booking:', errorData);
      }
    } catch (error) {
      console.error('Error during booking deletion:', error);
    }
  };

  const handleSnackbarClose = () => {
    setReviewSubmitted(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <Typography variant="h5" sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
        Manage Bookings
        <Snackbar
          open={reviewSubmitted}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="success">Review submitted successfully!</Alert>
        </Snackbar>
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="left"
                    style={{ minWidth: column.minWidth, width: column.width }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align="left">
                        {column.id === 'checkIn'
                          ? dayjs(row.dateRange.checkIn).format('DD-MM-YYYY')
                          : column.id === 'checkOut'
                            ? dayjs(row.dateRange.checkOut).format('DD-MM-YYYY')
                            : column.id === 'rating' && row.status === 'accepted'
                              ? (<Rating name={`rating-${row.id}`} value={ratingValue} onChange={(event, newValue) => setRatingValue(newValue)} />)
                              : column.id === 'review' && row.status === 'accepted'
                                ? (<>
                                  <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={1}
                                    value={row.review}
                                    label="Review"
                                    onChange={handleReviewChange}
                                  />
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleReviewSubmit(row.listingId, row.id)}
                                  >
                                    Submit
                                  </Button>
                                </>)
                                : column.id === 'actions'
                                  ? (
                                    // Delete button and its click handler
                                    <IconButton
                                      color="secondary"
                                      onClick={() => handleDeleteBooking(row.id)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                    )
                                  : (row[column.id])}

                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default ManageBookings;
