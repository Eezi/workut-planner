import { trpc } from "../utils/trpc";
import { useState } from "react";
import { PageHead } from "../components/Head";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";

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
    <div data-theme="nightforest">
      <PageHead title="Statistics" />
      <main className="flex min-h-screen flex-col items-center">
        {isLoading ? (
          <div>Fetching workouts...</div>
        ) : (
          <div className="mt-10 mb-20 px-5">
            <PeriodOfTimePicker
              timePeriod={timePeriod}
              setTimePeriod={setTimePeriod}
            />
            <h1 className="mt-5 text-xl font-semibold md:text-3xl">
              Number of sessions per workout
            </h1>
            <div className="stats stats-vertical mt-3 shadow lg:stats-horizontal">
              {data?.map(({ id, title, count }) => (
                <div key={id} className="stat">
                  <div className="stat-title text-center">{title}</div>
                  <div className="stat-value text-center">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Statistics;
