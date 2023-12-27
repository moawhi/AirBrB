import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, Typography } from '@mui/material';

const columns = [
  { id: 'id', label: 'Booking ID', minWidth: 50, width: 100 },
  { id: 'bookingOwner', label: 'Booking Owner', minWidth: 50, width: 170 },
  { id: 'checkIn', label: 'Check-in', minWidth: 50, width: 170 },
  { id: 'checkOut', label: 'Check-out', minWidth: 50, width: 170 },
  { id: 'totalPrice', label: 'Total Price', minWidth: 50, width: 170 },
  { id: 'status', label: 'Status', minWidth: 50, width: 170 },
  { id: 'actions', label: 'Actions', minWidth: 50, width: 240 },
];

const BookingRequests = ({ listingDetail }) => {
  const [page, setPage] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rerenderFlag, setRerenderFlag] = useState(true);

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
          // Filter out bookings with owner is not equal to the owner of the listing
          const filteredBookings = data.bookings.filter(
            (booking) => booking.listingId === listingDetail.id
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
  }, [rerenderFlag]);

  // Calculate the additional information
  const listingUpDuration = 1 + dayjs().diff(dayjs(listingDetail.postedOn), 'days');
  const bookedDaysThisYear = bookings
    .filter((booking) => dayjs(booking.dateRange.checkOut).year() === dayjs().year())
    .reduce((total, booking) => total + dayjs(booking.dateRange.checkOut).diff(booking.dateRange.checkIn, 'days'), 1);
  const profitThisYear = bookings
    .filter((booking) => dayjs(booking.dateRange.checkOut).year() === dayjs().year() && booking.status === 'accepted')
    .reduce((total, booking) => total + parseInt(booking.totalPrice), 0);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5005/bookings/accept/${bookingId}`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (response.ok) {
        // Update the status in the state or fetch the updated data
        console.log(`Booking ${bookingId} accepted`);
        setRerenderFlag(!rerenderFlag);
      } else {
        const errorData = await response.json();
        console.error('Failed to accept booking:', errorData);
      }
    } catch (error) {
      console.error('Error during accept booking:', error);
    }
  };

  const handleDeclineBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5005/bookings/decline/${bookingId}`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (response.ok) {
        // Update the status in the state or fetch the updated data
        console.log(`Booking ${bookingId} declined`);
        setRerenderFlag(!rerenderFlag);
      } else {
        const errorData = await response.json();
        console.error('Failed to decline booking:', errorData);
      }
    } catch (error) {
      console.error('Error during decline booking:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography variant="h5" sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
        Booking requests
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
                    {columns.map((column) => {
                      const value =
                        column.id === 'checkIn'
                          ? dayjs(row.dateRange.checkIn).format('DD-MM-YYYY')
                          : column.id === 'checkOut'
                            ? dayjs(row.dateRange.checkOut).format('DD-MM-YYYY')
                            : column.id === 'status'
                              ? row.status
                              : column.id === 'bookingOwner'
                                ? row.owner
                                : row[column.id];

                      if (column.id === 'actions') {
                        // Only show buttons if the status is 'pending'
                        return (
                          <TableCell key={column.id} align="left">
                            {row.status === 'pending' && (
                              <>
                                <Button
                                  variant="contained"
                                  onClick={() => handleAcceptBooking(row.id)}
                                  sx={{
                                    width: '80px',
                                    background: '#4caf50',
                                    color: '#fff',
                                    marginRight: '8px',
                                    fontFamily: 'Montserrat',
                                  }}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => handleDeclineBooking(row.id)}
                                  sx={{
                                    width: '80px',
                                    background: '#f44336',
                                    color: '#fff',
                                    fontFamily: 'Montserrat',
                                  }}
                                >
                                  Decline
                                </Button>
                              </>
                            )}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={column.id} align="left">
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TableRow>
            <TableCell colSpan={6} />
            <TableCell align="left">
              <Typography variant="body2" sx={{ fontWeight: '600' }}>
                Listing Up Duration: {listingUpDuration} days
              </Typography>
            </TableCell>
            <TableCell align="left">
              <Typography variant="body2" sx={{ fontWeight: '600' }}>
                Booked Days This Year: {bookedDaysThisYear} days
              </Typography>
            </TableCell>
            <TableCell align="left">
              <Typography variant="body2" sx={{ fontWeight: '600' }}>
                Profit This Year: ${profitThisYear}
              </Typography>
            </TableCell>
          </TableRow>
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
    </LocalizationProvider>
  );
};

export default BookingRequests;
