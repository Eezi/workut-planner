import { useState } from "react";
import { Modal } from "./AddSessionModal";
import { Intensity, Workout } from "../types/workout";
import { DateInput } from "./DateInput";
import { trpc } from "../utils/trpc";
import { WorkoutModalContent } from "./Modal";

const colors = new Map([
  ["HARD", "text-red-900"],
  ["MEDIUM", "text-amber-900"],
  ["EASY", "text-green-900"],
]);

const bgs = new Map([
  ["HARD", "bg-red-100"],
  ["MEDIUM", "bg-amber-100"],
  ["EASY", "bg-green-100"],
]);

interface Props {
  intensity: Intensity;
}

export const IntesityBadge = ({ intensity }: Props) => (
  <div
    className={`badge ${colors.get(intensity)} ${bgs.get(
      intensity
    )} p-3 font-semibold`}
  >
    {intensity}
  </div>
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
        data-theme="forest"
        className="card w-full bg-grey shadow-xl sm:w-1/2 md:w-2/3 lg:w-2/4 xl:w-1/4"
      >
        <div className="card-body">
          <div className="flex flex-col gap-2">
            <h2 className="flex gap-1 items-center card-title text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 512 512"
              onClick={() => setOpenWorkout(true)}
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
              {title}</h2>
            <button
              onClick={handleRemove}
              className="btn-outline btn-error btn-xs btn-square btn absolute right-2 top-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div
              className={`badge ${colors.get(intensity)} ${bgs.get(
                intensity
              )} p-3 font-semibold`}
            >
              {intensity}
            </div>
          </div>
          <button
            className="btn-outline btn-sm btn mt-3"
            onClick={() => setOpen(true)}
          >
            Create session
          </button>
          <div className="card-actions">
            <Modal open={open} onClose={() => setOpen(false)}>
              <div style={{ height: '26rem' }}>
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
