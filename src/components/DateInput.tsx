import React, { useState } from "react";
import Datepicker from "tailwind-datepicker-react";

interface Props {
  setDate: (newDate: Date) => void;
  date: Date;
  readOnly?: boolean;
}

const options = {
  title: "",
  autoHide: true,
  todayBtn: false,
  clearBtn: false,
  maxDate: new Date("2030-01-01"),
  minDate: new Date("1950-01-01"),
  theme: {
    background: "bg-gray-700 dark:bg-gray-800",
    p: 0,
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    //disabledText: "bg-red-500",
    input: "",
    inputIcon: "",
    selected: "",
  },
  icons: {
    // () => ReactElement | JSX.Element
    //prev: () => <span>Previous</span>,
    //next: () => <span>Next</span>,
  },
  datepickerClassNames: "text-xs relative z-50",
  defaultDate: new Date(),
  language: "en",
};

export const DateInput = ({ setDate }: Props) => {
  const [show, setShow] = useState<boolean>(false);

  const handleChange = (selectedDate: Date) => {
    setDate(selectedDate);
  };
  const handleClose = (state: boolean) => {
    setShow(state);
  };

  return (
    <Datepicker
      options={options}
      onChange={handleChange}
      show={show}
      setShow={handleClose}
    />
  );
};
