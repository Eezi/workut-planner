import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

interface Props {
    setDate: (newDate: Date) => void;
    date: Date;
  }

export const DateInput = ({ setDate, date }: Props) => {

  const handleValueChange = (newValue: { startDate: string, endDate: string }) => {
    const newDate = new Date(newValue.startDate);
    setDate(newDate);
  };

  return (
    <div>
      <Datepicker
        useRange={false}
        asSingle={true}
        value={{ startDate: date, endDate: date}}
        onChange={handleValueChange}
      />
    </div>
  );
};
