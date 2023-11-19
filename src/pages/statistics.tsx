import { trpc } from "../utils/trpc";
import { useState } from "react";
import { PageHead } from "../components/Head";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { PageTitle } from "../components/PageTitle";
import { SessionsTable, WorkoutSessionData } from "../components/SessionsTable";

interface Props {
  timePeriod: DateValueType;
  setTimePeriod: React.Dispatch<React.SetStateAction<DateValueType>>;
}

const PeriodOfTimePicker = ({ timePeriod, setTimePeriod }: Props) => {
  const handleValueChange = (newValue: DateValueType) => {
    setTimePeriod(newValue);
  };

  return (
    <div className="max-w-xs">
      <Datepicker
        placeholder={"Select Time Range"}
        value={timePeriod}
        onChange={handleValueChange}
        showShortcuts={true}
        useRange={false}
      />
    </div>
  );
};

const Statistics = () => {
  const [timePeriod, setTimePeriod] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const { data, isLoading } = trpc.workout.sessionCountsPerWorkout.useQuery({
    startDate: timePeriod?.startDate || null,
    endDate: timePeriod?.endDate || null,
  });
  return (
    <>
      <PageHead title="Statistics" />
      {isLoading ? (
        <div>Fetching workouts...</div>
      ) : (
        <div className="mb-20 px-5">
          <div className="mb-4">
            <PageTitle title="Number of sessions per workout" />
          </div>
          <PeriodOfTimePicker
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />
          <div className="pt-5">
            <SessionsTable sessionData={data as WorkoutSessionData[]} />
          </div>
        </div>
      )}
    </>
  );
};

export default Statistics;
