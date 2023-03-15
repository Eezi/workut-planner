import React from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";

interface Props {
  setDate: (newDate: DateValueType) => void;
  date: DateValueType;
}

export const DateInput = ({ setDate, date }: Props) => {
  const handleValueChange = (newValue: DateValueType) => {
    setDate(newValue);
  };

  return (
    <div>
      <Datepicker
        asSingle={true}
        value={date}
        onChange={handleValueChange}
      />
    </div>
  );
};
