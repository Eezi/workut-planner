import { type NextPage } from "next";
import { PageHead } from "../components/Head";
import { trpc } from "../utils/trpc";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { IntesityBadge } from "../components/workoutCard";
import { DateInput } from "../components/DateInput";
import cn from "classnames";
import dayjs from "dayjs";

interface Props {
  date: Date;
  handleEditSession: (id: string, date: Date) => void;
  chatId: string;
}

const DropDownDate = ({ date, handleEditSession, chatId }: Props) => {
  // add a state to toggle the dropdown
  const [open, setOpen] = useState<boolean>(false);

  //close the dropdown when clicking outside the referenced element
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  //onclick handler when clicking a menu item
  const handleClick = () => {
    setOpen(false);
  };
  return (
    <>
      <div
        // add toggle dropdown-open
        className={cn({
          dropdown: true,
          "dropdown-open": open,
        })}
        // add reference to the dropdown element
        ref={ref}
      >
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
          </svg>
        </button>
        <ul
          tabIndex={0}
          // add hidden class when the dropdown is not open
          className={cn({
            "dropdown-content menu rounded-box w-52 bg-base-200 p-2 shadow":
              true,
            hidden: !open,
          })}
        >
          <li>
            <DateInput
              date={date}
              setDate={(date) => {
                handleEditSession(chatId, date);
                handleClick();
              }}
            />
          </li>
        </ul>
      </div>
    </>
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

  useEffect(() => {
    if (!sessionData) router.push("/");
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

  const allSessions = sessions?.sort((a, b) => {
    if (a.done === true) return 1;
    return Number(new Date(a.date)) - Number(new Date(b.date));
  });

  return (
    <div data-theme="forest">
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
              {allSessions?.map(({ date, workout, done, id }) => (
                <div
                  key={id}
                  className="flex min-w-full items-center gap-4 rounded-xl bg-grey p-5"
                >
                  <div>
                    <input
                      type="checkbox"
                      className="checkbox-secondary checkbox"
                      defaultChecked={done}
                      onChange={({ target }) =>
                        handleMarkDone(id, target.checked)
                      }
                    />
                  </div>
                  <div className="ml-3 flex w-full flex-col">
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
                    <div className="my-1">
                      <IntesityBadge intensity={workout?.intensity} />
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <span className="text-gray-400">
                          {dayjs(date).format("dddd")} -{" "}
                          {dayjs(date).format("DD.MM.YYYY")}
                        </span>
                      </div>
                      <DropDownDate
                        chatId={id}
                        date={date}
                        handleEditSession={handleEditSession}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutSessions;
