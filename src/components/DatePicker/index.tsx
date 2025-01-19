import React from 'react';

interface DatePickerProps {
  onDateChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value + 'T00:00:00'); // Принудительно добавляем время
    onDateChange(selectedDate);
  };

  return (
    <div className="p-4 bg-gray-700 rounded-md">
      <label htmlFor="date" className="text-white mr-2">Select a date:</label>
      <input
        type="date"
        id="date"
        onChange={handleChange}
        className="p-2 rounded-md"
      />
    </div>
  );
};

export default DatePicker;