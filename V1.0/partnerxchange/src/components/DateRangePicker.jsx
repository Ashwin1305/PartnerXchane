import React, { useState } from 'react';
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DateRangePicker = () => {
    const [dateRange, setDateRange] = useState([null, null]);

    const handleDateChange = (selectedDates) => {
        if (selectedDates.length === 2) {
            const [start, end] = selectedDates;

            console.log("Start Date: ", formatDate(start));
            console.log("End Date: ", formatDate(end));

            const differenceInDays = calculateDifferenceInDays(start, end);
            console.log("Difference in Days: ", differenceInDays);
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const calculateDifferenceInDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const differenceInTime = endDate - startDate;
        return differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
    };

    return (
        <div>
            <Flatpickr
                options={{
                    mode: 'range',
                    dateFormat: 'Y-m-d'
                }}
                value={dateRange}
                onChange={handleDateChange}
            />
        </div>
    );
};

export default DateRangePicker;
