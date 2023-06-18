import { useState } from "react";
import { Modal } from "./AddSessionModal";
import { Intensity, Workout } from "../types/workout";
import { DateInput } from "./DateInput";
import { trpc } from "../utils/trpc";

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
    // Bug: jostain syystä workout Id on aina ekan treenin id kun submittaa
    postWorkoutSession.mutate({
      workoutId: id,
      userId: userId,
      date: new Date(),
      done: false,
    });
    setOpen(false);
  };
  return (
    <div
      data-theme="forest"
      className="card w-full bg-grey shadow-xl sm:w-1/2 md:w-2/3 lg:w-2/4 xl:w-1/4"
    >
      <div className="card-body">
        <div className="flex flex-col gap-2">
          <h2 className="card-title text-white">{title}</h2>
          <button onClick={handleRemove} className="btn-outline btn-error btn-square btn-xs btn absolute right-2 top-2">
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
        <p>{description}</p>
        <button
          className="btn-outline btn-sm btn mt-3"
          onClick={() => setOpen(true)}
        >
          Create session
        </button>
        <div className="card-actions justify-end">
          <Modal open={open} onClose={() => setOpen(false)}>
            <div
              style={{ height: "38rem" }}
              className="modal-box flex flex-col justify-between"
            >
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
                <DateInput setDate={setDate} date={date} />
              </div>
              <div className="modal-action">
                <label
                  onClick={handleSubmit}
                  htmlFor="my-modal-6"
                  className="btn"
                >
                  Create session
                </label>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};
