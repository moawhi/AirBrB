import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button } from '@mui/material';

const PublishDatePicker = ({ onSave }) => {
  const today = dayjs();
  const [valueStart, setValueStart] = React.useState(today);
  const [valueEnd, setValueEnd] = React.useState(today);

  const handleSaveDatesClick = () => {
    console.log(valueStart);

    onSave({ startDate: valueStart.$d, endDate: valueEnd.$d });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label="Start" defaultValue={today} onChange={(newValue) => setValueStart(dayjs(newValue))} />
      <br />
      <br />

      <DatePicker label="End" defaultValue={today} onChange={(newValue) => setValueEnd(newValue)} />
      <Button
        variant="contained"
        onClick={handleSaveDatesClick}
        sx={{
          background: '#ff3e61',
          margin: '10px 10px',
        }}
      >
        Add Availability
      </Button>
    </LocalizationProvider>
  );
};
export default PublishDatePicker;
