import { trpc } from "../utils/trpc";
import { useState } from "react";
import { PageHead } from "../components/Head";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { PageTitle } from "../components/PageTitle";
import { SessionsTable, WorkoutSessionData } from "../components/SessionsTable";
import PageTransition from "../components/PageTransition";
import { Rep, Workout, WorkoutSession } from "@prisma/client";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const DoneRepsTable = ({ doneReps }: { doneReps: Rep[] }) => {
  if (!doneReps || doneReps?.length <= 0) {
    return null;
  }
  return (
    <div className="collapse-arrow join-item collapse">
      <input type="checkbox" name="my-accordion-4" />
      <div className="collapse-title text-sm font-medium">Session reps</div>
      <div className="collapse-content">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Kg</TableHead>
              <TableHead>Seconds</TableHead>
              <TableHead>Reps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doneReps?.map((rep, index) => (
              <TableRow key={rep.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{rep?.weightAmount}</TableCell>
                <TableCell>{rep?.secoundsAmount}</TableCell>
                <TableCell>{rep?.repsAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

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

const Tabs = ({
  showDoneSessions,
  setShowDoneSessions,
}: {
  showDoneSessions: boolean;
  setShowDoneSessions: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="form-control pt-2">
      <label className="label cursor-pointer">
        <span className="label-text">Show done sessions</span>
        <input
          type="checkbox"
          className="toggle-primary toggle"
          checked={showDoneSessions}
          onChange={() => setShowDoneSessions(!showDoneSessions)}
        />
      </label>
    </div>
  );
};

export type SessionProps = WorkoutSession & { workout: Workout; reps: Rep[] };

export const SessionCard = ({ session }: { session: SessionProps }) => {
  const { workout, reps, done, doneAt, id } = session;
  const doneReps = reps?.filter(({ done: repDone }) => repDone);

  /* const handleSessionkDone = trpc.workoutSession.markSessionDone.useMutation();

  const handleDone = () => {
    handleSessionkDone.mutate({
      id,
      done: false,
    });
    refetch();
  }; */

  return (
    <div className="p- rounded-md border border-slate-800 p-3">
      <div className="flex items-center gap-4 ">
        <input
          type="checkbox"
          defaultChecked
          disabled
          // onChange={handleDone}
          className="checkbox"
        />
        <div>
          <p className="text-mase font-medium">{workout.title}</p>
          <span className="text-sm text-slate-400">
            {dayjs(doneAt).format("DD.MM.YYYY")}
          </span>
        </div>
      </div>
      <DoneRepsTable doneReps={doneReps} />
    </div>
  );
};

const DoneSessions = () => {
  const { data: sessionData, isLoading: sessionsLoading } =
    trpc.workoutSession.allDoneSessions.useQuery();

  return (
    <div className="grid gap-4 pt-3">
      {sessionData?.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};

type PageProps = {};
const Statistics = (
  props: PageProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [showDoneSessions, setShowDoneSessions] = useState(false);
  const [timePeriod, setTimePeriod] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const { data, isLoading } = trpc.workout.sessionCountsPerWorkout.useQuery({
    startDate: timePeriod?.startDate || null,
    endDate: timePeriod?.endDate || null,
  });

  return (
    <PageTransition ref={ref}>
      <PageHead title="Statistics" />
      {isLoading ? (
        <div>Fetching workouts...</div>
      ) : (
        <div className="mb-20">
          <div className="mb-4">
            <PageTitle title="Number of sessions per workout" />
          </div>
          <div className="mb-3">
            <Tabs
              showDoneSessions={showDoneSessions}
              setShowDoneSessions={setShowDoneSessions}
            />
          </div>
          {showDoneSessions ? (
            <DoneSessions />
          ) : (
            <>
              <PeriodOfTimePicker
                timePeriod={timePeriod}
                setTimePeriod={setTimePeriod}
              />
              <div className="pt-5">
                <SessionsTable sessionData={data as WorkoutSessionData[]} />
              </div>
            </>
          )}
        </div>
      )}
    </PageTransition>
  );
};

export default Statistics;
