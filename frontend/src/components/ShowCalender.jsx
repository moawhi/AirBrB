import React, { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const DateRangePickerExample = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDatesChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <div>
      <DateRangePicker
        startDate={dateRange.startDate} // momentPropTypes.momentObj or null,
        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
        endDate={dateRange.endDate} // momentPropTypes.momentObj or null,
        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
        onDatesChange={handleDatesChange} // PropTypes.func.isRequired,
        focusedInput={null} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={(focusedInput) => console.log(`Focused input changed to ${focusedInput}`)} // PropTypes.func.isRequired,
      />
    </div>
  );
};

export default DateRangePickerExample;
