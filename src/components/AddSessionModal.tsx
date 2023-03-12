import { useState } from "react";
import { DateInput } from './DateInput'
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

export const AddSessionModal = ({ workoutId }: { workoutId: string }) => {
  const [date, setDate] = useState(new Date());
  const { data: sessionData } = useSession();
  const utils = trpc.useContext();
  const postWorkoutSession = trpc.workoutSession.postWorkoutSession.useMutation({
    onMutate: () => {
      utils.workoutSession.getAllWorkoutSessions.cancel();
      const optimisticUpdate = utils.workoutSession.getAllWorkoutSessions.getData();

      if (optimisticUpdate) {
        /*utils.workoutSession.getAllWorkoutSessions.setData(
          "getAllWorkoutSessions",
          optimisticUpdate
        );*/
      }
    },
    onSettled: () => {
      utils.workoutSession.getAllWorkoutSessions.invalidate();
    },
  });

  const handleSubmit = () => {
    postWorkoutSession.mutate({
      workoutId,
      userId: sessionData?.user?.id || '',
      date,
      done: false,
    });
  };

  return (
    <>
      <label htmlFor="my-modal-6" className="btn">open modal</label>


      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box h-3/4 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-3">Select day for your workout</h3>
            <DateInput setDate={setDate} date={date} />
            </div>
          <div className="modal-action">
            <label onClick={handleSubmit} htmlFor="my-modal-6" className="btn">Create workout</label>
          </div>
        </div>
      </div>
    </>
  )
}
