import { type NextPage } from "next";
import { PageHead } from "../components/Head";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { Modal } from "../components/AddSessionModal";
import { Collapse } from "../components/Collapse";
import { WorkoutModalContent } from "../components/Modal";
import { IntesityBadge } from "../components/workoutCard";
import { DateInput } from "../components/DateInput";
import dayjs from "dayjs";
import { Session } from "../types/Session";
import cn from "classnames";
import { sliceLongText } from "../utils/sliceLongText";
import { PageTitle } from "../components/PageTitle";
import PageTransition from "../components/PageTransition";

/* const SessionNotes = ({
  sessionId,
  notes = "",
}: {
  sessionId: string;
  notes?: string;
}) => {
  const handleSessionkDone = trpc.workoutSession.editSessionNotes.useMutation();

  const handleEditNotes = (
    event: React.FocusEvent<HTMLTextAreaElement, Element>
  ) => {
    const {
      currentTarget: { value },
    } = event;
    handleSessionkDone.mutate({
      id: sessionId,
      notes: value,
    });
  };

  return (
    <div className="w-full">
      <textarea
        onBlur={handleEditNotes}
        defaultValue={notes}
        className="textarea-primary textarea w-full"
        placeholder="Notes"
      ></textarea>
    </div>
  );
}; */

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
    dropdown: true,
    "dropdown-left": true,
    "dropdown-end": true,
  });
  return (
    <div className={dropdownClassName}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        tabIndex={0}
        height="27"
        viewBox="0 0 512 512"
      >
        <path
          d="M136 216c-22.002 0-40 17.998-40 40s17.998 40 40 40 40-17.998 40-40-17.998-40-40-40zm240 0c-22.002 0-40 17.998-40 40s17.998 40 40 40 40-17.998 40-40-17.998-40-40-40zm-120 0c-22.002 0-40 17.998-40 40s17.998 40 40 40 40-17.998 40-40-17.998-40-40-40z"
          fill="currentColor"
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
    setTimeout(() => {
      handleSessionkDone.mutate({
        id: sessionId,
        done: checked,
      });
    }, 500);
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
      className="flex items-center gap-6 rounded-xl p-3"
      style={{ border: "1px solid #2c2d3c" }}
    >
      <Modal open={openWorkout} onClose={() => setOpenWorkout(false)}>
        <WorkoutModalContent
          title={title}
          description={description}
          intensity={intensity}
        />
      </Modal>
      <div className="grid place-content-center">
        <input
          type="checkbox"
          className="checkbox-primary checkbox"
          defaultChecked={done}
          onChange={({ target }) => handleMarkDone(id, target.checked)}
        />
      </div>

      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between">
          <div onClick={() => setOpenWorkout(true)} className="font-semibold">
            {sliceLongText(workout?.title)}
          </div>
          <div className="flex flex-col justify-between">
            <IntesityBadge isSmall intensity={workout?.intensity} />
            <ActionList
              handleRemove={handleRemove}
              handleOpenWorkout={() => setOpenWorkout(true)}
              handleOpen={() => setOpen(false)}
            />
          </div>
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

/* const Tabs = ({
  hideCompleted,
  setHideCompleted,
}: {
  hideCompleted: boolean;
  setHideCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="form-control w-40 pt-2">
      <label className="label cursor-pointer">
        <span className="label-text">Hide Comleted</span>
        <input
          type="checkbox"
          className="toggle-primary toggle"
          checked={hideCompleted}
          onChange={() => setHideCompleted(!hideCompleted)}
        />
      </label>
    </div>
  );
}; */

type GroupedData = {
  [key: string]: Session[];
};

const SessionCardContainer = ({
  nextSevenDaysSessions,
}: {
  nextSevenDaysSessions: GroupedData;
}) => {
  const gropedSessions = Object.keys(nextSevenDaysSessions);
  return (
    <>
      {gropedSessions?.map((dayKey) => (
        <div key={dayKey}>
          <div className="mb-3 flex items-end gap-1">
            <span className="mr-1 text-3xl font-bold">
              {dayjs(dayKey).format("D")}
            </span>
            <div className="grow">
              <span className="text-xl font-semibold">
                {dayjs(dayKey).format("dddd")}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {nextSevenDaysSessions[dayKey]?.map((session) => (
              <SessionCard key={session.id} {...session} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

type PageProps = {};
const WorkoutSessions: NextPage = (
  props: PageProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { data: sessions, isLoading } =
    trpc.workoutSession.getAllWorkoutSessions.useQuery();

  const groupByNextSevenDays = (
    sessions: Session[] | undefined
  ): GroupedData => {
    const nextSevenDays = Array.from({ length: 7 }, (_, i) =>
      dayjs().add(i, "day").format("YYYY-MM-DD")
    );

    const acc: GroupedData = nextSevenDays.reduce<GroupedData>((acc, date) => {
      acc[date] = [];
      return acc;
    }, {});

    sessions?.forEach((item) => {
      const date = dayjs(item.date).format("YYYY-MM-DD");
      if (acc[date]) {
        acc[date]?.push(item);
      }
    });

    return acc;
  };

  const nextSevenDaysSessions = groupByNextSevenDays(sessions);

  return (
    <PageTransition ref={ref}>
      <PageHead title="Sessions" />
      {isLoading ? (
        <div>Fetching sessions...</div>
      ) : (
        <div className="flex flex-col gap-6 px-4 py-1">
          <PageTitle title="Upcoming sessions" />
          <div className="mb-16 flex flex-col gap-10">
            <SessionCardContainer
              nextSevenDaysSessions={nextSevenDaysSessions}
            />
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default WorkoutSessions;
