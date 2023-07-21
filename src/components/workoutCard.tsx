import { useState } from "react";
import { Modal } from "./AddSessionModal";
import { Intensity, Workout } from "../types/workout";
import { DateInput } from "./DateInput";
import { trpc } from "../utils/trpc";
import { WorkoutModalContent } from "./Modal";
import Link from "next/link";

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
  intensity: Intensity;
  isSmall?: boolean;
}

export const IntesityBadge = ({ intensity, isSmall }: Props) => (
  <>
    {isSmall ? (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="" opacity=".2" /><path fill={colors.get(intensity)} d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z" /></svg>
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
      date: new Date(),
      done: false,
    });
    setOpen(false);
    setOpenWorkout(false);
  };

  return (
    <>
      <Modal open={openWorkout} onClose={() => setOpenWorkout(false)}>
        <WorkoutModalContent
          title={title}
          description={description}
          intensity={intensity}
        />
      </Modal>
      <div
        data-theme="night"
        className="card w-full bg-neutral shadow-xl sm:w-1/2 md:w-2/3 lg:w-2/4 xl:w-1/4"
      >
        <div className="p-4">
          <div className="flex gap-2">
              <IntesityBadge isSmall intensity={intensity} />
            <h2 className="md:text-xl font-semibold text-white">
              {title}
            </h2>
            <div className="dropdown-end dropdown ml-auto">
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
                        stroke-miterlimit="10"
                        stroke-width="32"
                        d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"
                      />
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-miterlimit="10"
                        stroke-width="32"
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
                          fill-rule="evenodd"
                          d="M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2h-3Zm-2-1H9v1h6V4Zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7Z"
                          clip-rule="evenodd"
                        />
                        <path d="M9 9h2v8H9V9Zm4 0h2v8h-2V9Z" />
                      </g>
                    </svg>
                    Remove
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="card-actions">
            <Modal open={open} onClose={() => setOpen(false)}>
              <div style={{ height: "26rem" }}>
                <label
                  htmlFor="my-modal-6"
                  className="btn-sm btn-circle btn absolute right-2 top-2"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </label>
                <div>
                  <h3 className="mb-3 text-lg font-bold">
                    Select day for your session
                  </h3>
                  <div className="flex gap-4">
                    <DateInput setDate={setDate} date={date} />
                    <div>
                      <label
                        onClick={handleSubmit}
                        htmlFor="my-modal-6"
                        className="btn"
                      >
                        Create session
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};
