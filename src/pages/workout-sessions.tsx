import { type NextPage } from "next";
import { PageHead } from "../components/Head";
import { trpc } from "../utils/trpc";
import { IntesityBadge } from "../components/workoutCard";
import dayjs from "dayjs";
import type { Session } from "../types/Session";
import cn from "classnames";
import { sliceLongText } from "../utils/sliceLongText";
import { PageTitle } from "../components/PageTitle";
import PageTransition from "../components/PageTransition";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

const ActionList = ({
  handleRemove,
  sessionId,
  removeIsPending,
}: {
  handleRemove: () => void;
  sessionId: string;
  removeIsPending: boolean;
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
        className="dropdown-content menu z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
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
          {removeIsPending ? (
            <span className="loading loading-dots loading-xs" />
          ) : (
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
          )}
        </li>
      </ul>
    </div>
  );
};

const SessionCard = ({
  id,
  done,
  workout,
  date,
  noDateSection,
}: Session & { noDateSection?: boolean }) => {
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
    }, 800);
  };

  const handleRemove = () => {
    removeSession.mutate({
      id,
    });
  };

  return (
    <div
      key={id}
      className="flex items-center gap-3 px-3 py-2"
      style={{
        // GborderTop: "1px solid #2c2d3c",
        borderBottom: "1px solid #2c2d3c",
      }}
    >
      <div className="grid place-content-center">
        <Checkbox
          checked={done}
          onCheckedChange={(newValue) =>
            handleMarkDone(id, newValue as boolean)
          }
        />
      </div>

      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-medium">
            <IntesityBadge isSmall intensity={workout?.intensity} />
            <div>
              <Link
                href={{
                  pathname: "/session-view/[slug]",
                  query: { slug: id },
                }}
              >
                {sliceLongText(workout?.title)}
              </Link>
              {noDateSection && (
                <p className="text-xs font-normal text-slate-400">
                  {dayjs(date).format("DD.MM.")}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <ActionList
              handleRemove={handleRemove}
              removeIsPending={removeSession.isLoading}
              sessionId={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const late = "Late";
const upcoming = "Upcoming";

type GroupedData = {
  [key: string]: Session[];
};

const SessionCardContainer = ({
  nextSevenDaysSessions,
}: {
  nextSevenDaysSessions: GroupedData;
}) => {
  const groupedSessions = Object.keys(nextSevenDaysSessions);
  const showLateOrUpcomingHeader = (
    groupKey: keyof typeof nextSevenDaysSessions
  ) => {
    if (nextSevenDaysSessions) {
      const group = nextSevenDaysSessions[groupKey];
      if ((groupKey === late || groupKey === upcoming) && group) {
        return group.length > 0;
      }
    }
    return false;
  };
  return (
    <>
      {groupedSessions?.map((dayKey, index) => (
        <div key={dayKey}>
          {showLateOrUpcomingHeader(dayKey) ? (
            <div className="mb-3" style={{ borderBottom: "1px solid #2c2d3c" }}>
              <span className="text-base font-semibold">{dayKey}</span>
              <div className="flex flex-col gap-3">
                {nextSevenDaysSessions[dayKey]?.map((session) => (
                  <SessionCard noDateSection key={session.id} {...session} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-end gap-1">
                <span className="mr-1 text-base font-semibold">
                  {dayjs(dayKey).format("D")}
                </span>
                <div className="grow">
                  <span className="text-base font-semibold">
                    {dayjs(dayKey).format("dddd")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {nextSevenDaysSessions[dayKey]?.map((session) => (
                  <SessionCard key={session.id} {...session} />
                ))}
              </div>
            </>
          )}
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
    const sevenDays = Array.from({ length: 7 }, (_, i) =>
      dayjs().add(i, "day").format("YYYY-MM-DD")
    );
    const nextSevenDays = [late, ...sevenDays, upcoming];

    const acc: GroupedData = nextSevenDays.reduce<GroupedData>((acc, date) => {
      acc[date] = [];
      return acc;
    }, {});

    sessions?.forEach((item: any) => {
      const date = dayjs(item.date).format("YYYY-MM-DD");
      const sessionIsPast = dayjs(item.date).isBefore(dayjs(), "day");
      if (sessionIsPast) {
        return acc[late]?.push(item);
      }
      const upcomingDate = sevenDays[sevenDays.length - 1];
      const sessionIsFarInFuture = dayjs(item.date).isAfter(
        upcomingDate,
        "day"
      );

      if (sessionIsFarInFuture) {
        return acc[upcoming]?.push(item);
      }

      if (acc[date]) {
        acc[date]?.push(item);
      }
    });

    if (acc[late] && acc[late].length <= 0) {
      delete acc[late];
    }
    if (acc[upcoming] && acc[upcoming].length <= 0) {
      delete acc[upcoming];
    }

    return acc;
  };

  const nextSevenDaysSessions = groupByNextSevenDays(sessions);

  return (
    <PageTransition ref={ref}>
      <PageHead title="Sessions" />
      {isLoading ? (
        <div>Fetching sessions...</div>
      ) : (
        <div
          /*style={{
            width: "100vw",
            position: "absolute",
            left: -20,
            }} */
          className="border-1 flex flex-col gap-6 "
        >
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
