import { type NextPage } from "next";
import { PageHead } from "../components/Head";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { IntesityBadge } from "../components/workoutCard";
import { DateInput } from "../components/DateInput";
import dayjs from "dayjs";
import { Session } from "../types/Session";

const SessionCard = ({
  id,
  done,
  date,
  workout,
  refetch,
}: Session & { refetch: () => void }) => {
  const [open, setOpen] = useState<boolean>(true);

  const markSessionDone = trpc.workoutSession.markSessionDone.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const editSession = trpc.workoutSession.editSession.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const removeSession = trpc.workoutSession.removeSession.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleMarkDone = (sessionId: string, checked: boolean) => {
    markSessionDone.mutate({
      id: sessionId,
      done: checked,
    });
  };

  const handleEditSession = (sessionId: string, date: Date) => {
    editSession.mutate({
      id: sessionId,
      date,
    });
  };

  const handleRemove = (sessionId: string) => {
    removeSession.mutate({
      id: sessionId,
    });
  };

  return (
    <div
      key={id}
      className="flex min-w-full items-center gap-4 rounded-xl bg-grey p-5"
    >
      <div>
        <input
          type="checkbox"
          className="checkbox-secondary checkbox"
          defaultChecked={done}
          onChange={({ target }) => handleMarkDone(id, target.checked)}
        />
      </div>
      <div className="flex w-full flex-col">
        <div className="flex justify-between">
          <span className="label-text text-xl text-white">
            {workout?.title}
          </span>
          <button
            onClick={() => handleRemove(id)}
            className="btn-outline btn-square btn-xs btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-2 mb-3">
          <IntesityBadge intensity={workout?.intensity} />
        </div>
        <div className="flex gap-2">
          <button
            tabIndex={0}
            className="sdsssbtn btn-outline btn-square btn-xs btn"
            onClick={() => setOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
            </svg>
          </button>
          <span className="text-gray-400">
            {dayjs(date).format("dddd")} - {dayjs(date).format("DD.MM.YYYY")}
          </span>
        </div>
        {!open ? (
          <div className="mt-3">
            <DateInput
              date={date}
              readOnly={open}
              setDate={(date) => {
                handleEditSession(id, date);
                setOpen(true);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const WorkoutSessions: NextPage = () => {
  const {
    data: sessions,
    isLoading,
    refetch,
  } = trpc.workoutSession.getAllWorkoutSessions.useQuery();
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  const allSessions = sessions?.sort((a, b) => {
    if (a.done === true) return 1;
    return Number(new Date(a.date)) - Number(new Date(b.date));
  });

  return (
    <div data-theme="forest" className="h-screen">
      <PageHead title="Sessions" />
      <main className="flex min-h-screen flex-col items-center">
        {isLoading ? (
          <div>Fetching sessions...</div>
        ) : (
          <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
            <h4 className="text-2xl font-extrabold tracking-tight text-white sm:text-[3rem]">
              All Workout Sessions
            </h4>
            <div className="grid w-full grid-cols-1 gap-4 md:w-5/12 md:gap-8">
              {allSessions?.map((session) => (
                <SessionCard key={session.id} refetch={refetch} {...session} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutSessions;
