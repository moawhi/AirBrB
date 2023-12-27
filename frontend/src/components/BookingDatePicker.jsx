import React from 'react';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, TextField, Typography } from '@mui/material';

const BookingDatePicker = ({ price }) => {
  const today = dayjs();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [valueStart, setValueStart] = React.useState(today);
  const [valueEnd, setValueEnd] = React.useState(today);
  const [guestNumber, setGuestNumber] = React.useState(1);
  const [bookingDetails, setBookingDetails] = React.useState({
    dateRange: {},
    totalPrice: 0
  });
  const [bookingResult, setBookingResult] = React.useState(null);

  const token = localStorage.getItem('token');

  const calculateTotal = () => {
    const checkIn = dayjs(valueStart);
    const checkOut = dayjs(valueEnd);
    const numberOfDays = checkOut.diff(checkIn, 'day') + 1;
    const total = price * numberOfDays * guestNumber;
    return total.toFixed(2);
  };

  const handleCheckInChange = (newValue) => {
    setValueStart(dayjs(newValue));
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      dateRange: { checkIn: newValue.$d, checkOut: valueEnd.$d },
    }));
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      totalPrice: calculateTotal(guestNumber),
    }));
  };

  const handleCheckOutChange = (newValue) => {
    setValueEnd(dayjs(newValue));
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      dateRange: { checkIn: valueStart.$d, checkOut: newValue.$d },
    }));
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      totalPrice: calculateTotal(guestNumber),
    }));
  };

  const handleGuestNumberChange = (event) => {
    const newGuestNumber = Number(event.target.value);
    setGuestNumber(newGuestNumber);
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      totalPrice: calculateTotal(newGuestNumber),
    }));
  };

  const handleBooking = async () => {
    console.log(bookingDetails);
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      totalPrice: calculateTotal(guestNumber),
    }));
    if (!token) {
      navigate('/login');
    } else {
      try {
        const response = await fetch(`http://localhost:5005/bookings/new/${listingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingDetails),
        });

        if (response.ok) {
          const data = await response.json();
          // Show confirmation or perform any other actions
          console.log('Booking successful:', data);
          setBookingResult(data.bookingId);
        } else {
          const data = await response.json();
          // Handle error response
          console.error('Booking failed:', data.error);
          alert(data.error);
        }
      } catch (error) {
        console.error('Error during booking:', error);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography variant="h5" sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
        Book this property
      </Typography>
      <br />
      <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
        ${calculateTotal()} AUD total
      </Typography>
      {bookingResult && (
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: '500', color: 'green' }}>
          Booking successfull!
          Your booking Id is {bookingResult}
        </Typography>
      )}
      <br />
      <br />
      <DatePicker
        label="Check-in"
        defaultValue={today}
        onChange={handleCheckInChange}
      />
      <br />
      <br />
      <DatePicker
        label="Check-out"
        defaultValue={today}
        onChange={handleCheckOutChange}
      />
      <br />
      <br />
      <TextField
        label="Number of guests"
        type="number"
        defaultValue="1"
        onChange={handleGuestNumberChange}
      />
      <br />
      <Button
        variant="contained"
        onClick={handleBooking}
        sx={{
          background: '#ff3e61',
          margin: '10px 0px',
          fontFamily: 'Montserrat',
        }}
      >
        Book now
      </Button>
    </LocalizationProvider>
  );
};

export default BookingDatePicker;
