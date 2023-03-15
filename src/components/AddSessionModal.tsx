import { useState } from "react";
import { DateInput } from "./DateInput";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";

export const AddSessionModal = ({ workoutId }: { workoutId: string }) => {
  const [date, setDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const { data: sessionData } = useSession();
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

  const handleSubmit = () => {
    postWorkoutSession.mutate({
      workoutId,
      userId: sessionData?.user?.id || "",
      date: date?.startDate ? new Date(date.startDate) : new Date(),
      done: false,
    });
  };

  return (
    <>
      <label htmlFor="my-modal-6" className="btn">
        Create Session
      </label>

      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex h-3/4 flex-col justify-between">
          <label
            htmlFor="my-modal-6"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <div>
            <h3 className="mb-3 text-lg font-bold">
              Select day for your workout
            </h3>
            <DateInput setDate={setDate} date={date} />
          </div>
          <div className="modal-action">
            <label onClick={handleSubmit} htmlFor="my-modal-6" className="btn">
              Create workout
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
