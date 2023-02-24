import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

export const DateInput = () => {
  const [value, setValue] = useState(new Date());

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  return (
    <div>
      <Datepicker
        useRange={false}
        asSingle={true}
        value={value}
        onChange={handleValueChange}
      />
    </div>
  );
};
