import { type NextPage } from "next";
import { PageHead } from "../components/Head";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "../components/AddSessionModal";
import { Collapse } from '../components/Collapse';
import { WorkoutModalContent } from "../components/Modal";
import { useRouter } from "next/router";
import { IntesityBadge } from "../components/workoutCard";
import { DateInput } from "../components/DateInput";
import dayjs from "dayjs";
import { Session } from "../types/Session";
import cn from "classnames";
import { sliceLongText } from '../utils/sliceLongText';

const SessionNotes = ({ sessionId, notes = "" }: { sessionId: string, notes: string }) => {
  const handleSessionkDone = trpc.workoutSession.editSessionNotes.useMutation();

  const handleEditNotes = (event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    const { currentTarget: { value } } = event
    console.log('value', value)
    handleSessionkDone.mutate({
      id: sessionId,
      notes: value,
    });
  };

  return (
    <div className="w-full">
      <textarea onBlur={handleEditNotes} defaultValue={notes} className="textarea textarea-primary w-full" placeholder="Notes"></textarea>
    </div>
  )
}

const ActionList = ({
  handleRemove,
  handleOpen,
  handleOpenWorkout,
}: {
  handleOpen: () => void;
  handleRemove: () => void;
  handleOpenWorkout: () => void;
}) => {
  const dropdownClassName = cn({
    "dropdown": true,
    "dropdown-left": true,
    "dropdown-end": true,
  });
  return (
    <div className={dropdownClassName}>
      <svg
        tabIndex={0}
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M14 6a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"
        />
      </svg>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box z-[1] w-52 bg-base-100 p-2 shadow"
      >
        <li onClick={handleOpenWorkout}>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 512 512"
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
            Details
          </a>
        </li>
        <li onClick={handleOpen}>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
              />
            </svg>
            Edit Date
          </a>
        </li>
        <li onClick={handleRemove}>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <g fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2h-3Zm-2-1H9v1h6V4Zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7Z"
                  clipRule="evenodd"
                />
                <path d="M9 9h2v8H9V9Zm4 0h2v8h-2V9Z" />
              </g>
            </svg>
            Remove
          </a>
        </li>
      </ul>
    </div>
  );
};

const SessionCard = ({ id, done, date, workout, notes }: Session) => {
  const [open, setOpen] = useState<boolean>(true);
  const [openWorkout, setOpenWorkout] = useState(false);

  const utils = trpc.useContext();

  const handleSessionkDone = trpc.workoutSession.markSessionDone.useMutation({
    onMutate: async (newEntry: any) => {
      await utils.workoutSession.getAllWorkoutSessions.cancel();
      utils.workoutSession.getAllWorkoutSessions.setData(
        undefined,
        (prevEntries: any) => {
          if (prevEntries && newEntry) {
            return prevEntries.map((item: Session) => {
              if (item.id === newEntry.id) {
                return {
                  ...item,
                  done: newEntry.done,
                };
              }
              return item;
            });
          }
        }
      );
    },
    onSettled: async () => {
      await utils.workoutSession.getAllWorkoutSessions.invalidate();
    },
  });

  const editSession = trpc.workoutSession.editSession.useMutation({
    onMutate: async (newEntry: any) => {
      await utils.workoutSession.getAllWorkoutSessions.cancel();
      utils.workoutSession.getAllWorkoutSessions.setData(
        undefined,
        (prevEntries: any) => {
          if (prevEntries && newEntry) {
            return prevEntries.map((item: Session) => {
              if (item.id === newEntry.id) {
                return {
                  ...item,
                  date: newEntry.date,
                };
              }
              return item;
            });
          }
        }
      );
    },
    onSettled: async () => {
      await utils.workoutSession.getAllWorkoutSessions.invalidate();
    },
  });

  const removeSession = trpc.workoutSession.removeSession.useMutation({
    onMutate: async (newEntry: any) => {
      await utils.workoutSession.getAllWorkoutSessions.cancel();
      utils.workoutSession.getAllWorkoutSessions.setData(
        undefined,
        (prevEntries: any) => {
          if (prevEntries) {
            return prevEntries.filter(({ id }: Session) => id !== newEntry.id);
          }
        }
      );
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

  const handleRemove = () => {
    removeSession.mutate({
      id,
    });
  };

  const { title, description, intensity } = workout;

  return (
    <div
      key={id}
      className="flex min-w-full items-center gap-4 rounded-xl p-3"
      style={{ border: "1px solid #2c2d3c" }}
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
      <Collapse Content={<SessionNotes sessionId={id} notes={notes} />}>
            <div
              onClick={() => setOpenWorkout(true)}
              className="label-text flex flex-grow items-center gap-3 text-base text-white md:text-lg"
            >
              <IntesityBadge isSmall intensity={workout?.intensity} />
              {sliceLongText(workout?.title)}
            </div>
      </Collapse>
            <ActionList
              handleRemove={handleRemove}
              handleOpenWorkout={() => setOpenWorkout(true)}
              handleOpen={() => setOpen(false)}
            />
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-gray-400">
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

const tabs = [
  { label: 'All', key: 'all' },
  { label: 'Today', key: 'today' },
  { label: 'Week', key: 'week' },
  { label: 'Hide Completed', key: 'hide' },
]

const Tabs = ({ setActiveTab, activeTab }: {
  setActiveTab: (tab: string) => void;
  activeTab: string
}) => {

  const renderClass = (key: string) => {
    if (key === activeTab) return 'tab tab-active'
    return 'tab'
  }

  return (
    <div className="tabs tabs-boxed">
      {tabs.map(({ label, key }) => (
        <a onClick={() => setActiveTab(key)} key={key} className={renderClass(key)}>{label}</a>
      ))}
    </div>
  )
}

const WorkoutSessions: NextPage = () => {
  const {
    data: sessions,
    isLoading,
  } = trpc.workoutSession.getAllWorkoutSessions.useQuery();
  // const { data: sessionData } = useSession();
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState('all')

  /*useEffect(() => {
    if (!sessionData) router.push("/");
  }, []);*/



  const handleFilteredSessions = () => {
    if (activeTab === 'week') {

      const thisWeek = sessions?.filter(({ date }) =>
        dayjs(date).isSame(dayjs(), "week")
      );
      return thisWeek;

    }
    if (activeTab === 'today') {

      const todaySessions = sessions?.filter(({ date }) =>
        dayjs(date).isSame(dayjs(), "day")
      );
      return todaySessions;
    }

    if (activeTab === 'hide') {

      const hideDones = sessions?.filter(({ done }) => done !== true);
      return hideDones
    }
    return sessions;
  }

  const filteredSessions = handleFilteredSessions();

  const allSessions = filteredSessions?.sort((a, b) => {
    if (a.done === true) return 1;
    return Number(new Date(a.date)) - Number(new Date(b.date));
  });

  return (
    <div data-theme="nightforest" className="h-full">
      <PageHead title="Sessions" />
      <main className="flex min-h-screen flex-col items-center">
        {isLoading ? (
          <div>Fetching sessions...</div>
        ) : (
          <div className="container flex flex-col items-center gap-4 px-4 py-8">
            <h4 className="text-xl font-bold tracking-tight text-white sm:text-[3rem]">
              All Workout Sessions
            </h4>
            <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />
            <div className="grid mb-16 w-full grid-cols-1 gap-4 md:w-5/12 md:gap-8">
              {allSessions?.map((session) => (
                <SessionCard key={session.id} {...session} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutSessions;
