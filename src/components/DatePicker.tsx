import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

export const DateInput = ({ setDate, date }) => {

  const handleValueChange = (newValue) => {
    console.log('new VALUIE', newValue)
    setDate(newValue);
  };

  return (
    <div>
      <Datepicker
        useRange={false}
        asSingle={true}
        value={date}
        onChange={handleValueChange}
      />
    </div>
  );
};
