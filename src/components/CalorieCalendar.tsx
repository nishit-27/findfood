import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalorieData {
  date: string;
  calories: number;
}

interface CalorieCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const CalorieCalendar: React.FC<CalorieCalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [calorieData, setCalorieData] = useState<CalorieData[]>([]);

  useEffect(() => {
    fetchCalorieData();
  }, []);

  const fetchCalorieData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Fetch data for the last 30 days

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/calorie-intake-range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCalorieData(data);
      } else {
        console.error('Failed to fetch calorie data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching calorie data:', error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date && date <= new Date()) {
      onDateSelect(date);
    }
  };

  const highlightWithCalories = (date: Date): string => {
    const calorieInfo = calorieData.find(d => d.date === date.toISOString().split('T')[0]);
    if (calorieInfo) {
      return "bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200";
    }
    return "";
  };

  // Get today's date at the end of the day
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const filterDate = (date: Date) => {
    return date <= today;
  };

  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MMMM d, yyyy"
        maxDate={today}
        filterDate={filterDate}
        dayClassName={highlightWithCalories}
        customInput={
          <button className="flex items-center bg-white border border-indigo-300 rounded-md px-3 py-2 text-sm leading-5 font-medium text-indigo-700 hover:text-indigo-500 focus:outline-none focus:border-indigo-400 focus:shadow-outline-indigo active:bg-indigo-50 active:text-indigo-800 transition ease-in-out duration-150">
            <CalendarIcon className="mr-2 h-5 w-5 text-indigo-400" />
            {selectedDate.toLocaleDateString()}
          </button>
        }
        calendarClassName="bg-white shadow-lg rounded-lg border border-indigo-200"
      />
    </div>
  );
};

export default CalorieCalendar;
