import { type NextPage } from "next";
import { PageHead } from "../components/Head";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "../components/AddSessionModal";
import { WorkoutModalContent } from "../components/Modal";
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
}: Session) => {
  const [open, setOpen] = useState<boolean>(true);
  const [openWorkout, setOpenWorkout] = useState(false);

const utils = trpc.useContext();

const handleSessionkDone = trpc.workoutSession.markSessionDone.useMutation({
  onMutate: async (newEntry: any) => {
    await utils.workoutSession.getAllWorkoutSessions.cancel();
    utils.workoutSession.getAllWorkoutSessions.setData(undefined, (prevEntries: any) => {
      if (prevEntries && newEntry) {
        return prevEntries.map((item: Session) => {
          if (item.id === newEntry.id) {
            return {
              ...item,
              done: newEntry.done,
            }
          }
          return item;
        })
      }
    });
  },
  onSettled: async () => {
    await utils.workoutSession.getAllWorkoutSessions.invalidate();
  },
});

  const editSession = trpc.workoutSession.editSession.useMutation({
  onMutate: async (newEntry: any) => {
    await utils.workoutSession.getAllWorkoutSessions.cancel();
    utils.workoutSession.getAllWorkoutSessions.setData(undefined, (prevEntries: any) => {
      if (prevEntries && newEntry) {
        return prevEntries.map((item: Session) => {
          if (item.id === newEntry.id) {
            return {
              ...item,
              date: newEntry.date,
            }
          }
          return item;
        })
      }
    });
  },
  onSettled: async () => {
    await utils.workoutSession.getAllWorkoutSessions.invalidate();
  },
  });

  const removeSession = trpc.workoutSession.removeSession.useMutation({
  onMutate: async (newEntry: any) => {
    await utils.workoutSession.getAllWorkoutSessions.cancel();
    utils.workoutSession.getAllWorkoutSessions.setData(undefined, (prevEntries: any) => {
      if (prevEntries) {
        return prevEntries.filter(({ id }: Session) => id !== newEntry.id)    
      }
    });
  },
  onSettled: async () => {
    await utils.workoutSession.getAllWorkoutSessions.invalidate();
  },
  });

  const handleMarkDone = (sessionId: string, checked: boolean) => {
    handleSessionkDone.mutate({
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

  const { title, description, intensity } = workout;

  return (
    <div
      key={id}
      className="flex min-w-full items-center gap-4 rounded-xl bg-neutral p-5"
    >
      <Modal open={openWorkout} onClose={() => setOpenWorkout(false)}>
        <WorkoutModalContent
          title={title}
          description={description}
          intensity={intensity}
        />
      </Modal>
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
          <span className="flex items-center gap-1 label-text text-xl text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 512 512"
              onClick={() => setOpenWorkout(true)}
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M338.29 338.29L448 448"
              />
            </svg>
            {workout?.title}
          </span>
          <button
            onClick={() => handleRemove(id)}
            className="btn-outline btn-error btn-xs btn-square btn"
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
            className="sdsssbtn btn-outline btn-xs btn-square btn"
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

  console.log('all sess', allSessions)
  return (
    <div data-theme="night" className="h-full">
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
