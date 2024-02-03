import { type NextPage } from "next";
import { PageHead } from "../components/Head";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { IntesityBadge } from "../components/workoutCard";
import dayjs from "dayjs";
import type { Session } from "../types/Session";
import cn from "classnames";
import { sliceLongText } from "../utils/sliceLongText";
import { PageTitle } from "../components/PageTitle";
import PageTransition from "../components/PageTransition";
import Link from "next/link";

const ActionList = ({
  handleRemove,
  sessionId,
}: {
  handleRemove: () => void;
  sessionId: string;
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
        <li>
          <Link
            href={{
              pathname: "/session-view/[slug]",
              query: { slug: sessionId },
            }}
          >
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
          </Link>
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

const SessionCard = ({ id, done, workout }: Session) => {
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
          <div className="font-semibold">
            <Link
              href={{
                pathname: "/session-view/[slug]",
                query: { slug: id },
              }}
            >
              {sliceLongText(workout?.title)}
            </Link>
          </div>
          <div className="flex flex-col justify-between">
            <IntesityBadge isSmall intensity={workout?.intensity} />
            <ActionList handleRemove={handleRemove} sessionId={id} />
          </div>
        </div>
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

  const groupByNextSevenDays = (sessions: any): GroupedData => {
    const nextSevenDays = Array.from({ length: 7 }, (_, i) =>
      dayjs().add(i, "day").format("YYYY-MM-DD")
    );

    const acc: GroupedData = nextSevenDays.reduce<GroupedData>((acc, date) => {
      acc[date] = [];
      return acc;
    }, {});

    sessions?.forEach((item: any) => {
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
