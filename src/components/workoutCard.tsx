import { useState } from "react";
import { Modal } from "./AddSessionModal";
import { Workout } from "../types/workout";
import { DateInput } from "./DateInput";
import { trpc } from "../utils/trpc";
import { WorkoutModalContent } from "./Modal";
import Link from "next/link";
import cn from "classnames";
import { sliceLongText } from "../utils/sliceLongText";

const colors = new Map([
  ["HARD", "#ff4b3f"],
  ["MEDIUM", "#ff9a14"],
  ["EASY", "#5297ff"],
]);

const badgeColors = new Map([
  ["HARD", "text-red-900"],
  ["MEDIUM", "text-amber-900"],
  ["EASY", "text-blue-900"],
]);

const bgs = new Map([
  ["HARD", "bg-red-100"],
  ["MEDIUM", "bg-amber-100"],
  ["EASY", "bg-blue-100"],
]);

interface Props {
  intensity: string;
  isSmall?: boolean;
}

const AddSessionModalContent = ({
  setDate,
  date,
  handleSubmit,
  setOpen,
}: {
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  date: Date;
  handleSubmit: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div>
    <label
      htmlFor="my-modal-6"
      className="btn btn-sm btn-circle absolute right-2 top-2"
      onClick={() => setOpen(false)}
    >
      ✕
    </label>
    <div className="min-h-[34rem]">
      <h3 className="mb-3 text-lg font-bold">Select day for your session</h3>
      <div>
        <DateInput setDate={setDate} date={date} />
      </div>

      <div className="mt-5">
        <label
          onClick={handleSubmit}
          htmlFor="my-modal-6"
          className="btn-primary btn"
        >
          Create session
        </label>
      </div>
    </div>
  </div>
);

export const IntesityBadge = ({ intensity, isSmall }: Props) => (
  <>
    {isSmall ? (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
        >
          <path
            fill={colors.get(intensity)}
            fillRule="evenodd"
            d="m6 15.235l6 3.333l6-3.333v-6.47l-6-3.333l-6 3.333v6.47ZM12 2L3 7v10l9 5l9-5V7l-9-5Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    ) : (
      <div
        className={`badge ${badgeColors.get(intensity)} ${bgs.get(
          intensity
        )} p-3 font-semibold`}
      >
        {intensity}
      </div>
    )}
  </>
);

export const WorkoutCard = ({
  title,
  description,
  intensity,
  id,
  userId,
  refetch,
}: Workout & { refetch: () => void }) => {
  const [open, setOpen] = useState(false);
  const [openWorkout, setOpenWorkout] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const utils = trpc.useContext();
  const postWorkoutSession = trpc.workoutSession.postWorkoutSession.useMutation(
    {
      onMutate: () => {
        utils.workoutSession.getAllWorkoutSessions.cancel();
        const optimisticUpdate =
          utils.workoutSession.getAllWorkoutSessions.getData();

        if (optimisticUpdate) {
          utils.workoutSession.getAllWorkoutSessions.setData(
            undefined,
            optimisticUpdate
          );
        }
      },
      onSettled: () => {
        utils.workoutSession.getAllWorkoutSessions.invalidate();
      },
    }
  );

  const removeWorkout = trpc.workout.removeWorkout.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleRemove = () => {
    removeWorkout.mutate({
      id,
    });
  };

  const handleSubmit = () => {
    postWorkoutSession.mutate({
      workoutId: id,
      userId: userId,
      date: date,
      done: false,
    });
    setOpen(false);
    setOpenWorkout(false);
  };

  const dropdownClassName = cn({
    dropdown: true,
    "dropdown-left": true,
    "dropdown-end": true,
    "ml-auto": true,
  });

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <AddSessionModalContent
          setDate={setDate}
          date={date}
          setOpen={setOpen}
          handleSubmit={handleSubmit}
        />
      </Modal>
      <Modal open={openWorkout} onClose={() => setOpenWorkout(false)}>
        <WorkoutModalContent
          title={title}
          description={description}
          intensity={intensity}
        />
      </Modal>
      <div
        data-theme="nightforest"
        className="card-border w-full rounded-md bg-neutral shadow-xl"
      >
        <div className="p-4">
          <div className="flex gap-2">
            <IntesityBadge isSmall intensity={intensity} />
            <h2 className="text-white md:text-xl">{sliceLongText(title)}</h2>
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
                <li onClick={() => setOpen(true)}>
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 4a1 1 0 0 0-1 1v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5a1 1 0 0 0-1-1Z"
                      />
                    </svg>
                    Create session
                  </a>
                </li>
                <li onClick={() => setOpenWorkout(true)}>
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
                <li>
                  <Link
                    href={{
                      pathname: "/create-workout/[slug]",
                      query: { slug: id },
                    }}
                  >
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
                    Edit
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
                <li>
                  <Link
                    href={{
                      pathname: "/workout-notes/[slug]",
                      query: { slug: id },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M4 14v-2h7v2zm0-4V8h11v2zm0-4V4h11v2zm9 14v-3.075l5.525-5.5q.225-.225.5-.325t.55-.1q.3 0 .575.113t.5.337l.925.925q.2.225.313.5t.112.55q0 .275-.1.563t-.325.512l-5.5 5.5zm7.5-6.575l-.925-.925zm-6 5.075h.95l3.025-3.05l-.45-.475l-.475-.45l-3.05 3.025zm3.525-3.525l-.475-.45l.925.925z"
                      />
                    </svg>
                    Notes
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
