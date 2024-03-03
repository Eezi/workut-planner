import { useState } from "react";
import { trpc } from "../utils/trpc";

export const AddNotes = ({
  workoutId,
  workoutSessionId,
  refetch,
}: {
  workoutId: string;
  workoutSessionId?: string;
  refetch?: () => void;
}) => {
  const [currentNote, setCurrentNote] = useState("");

  const postNote = trpc.note.postNote.useMutation({
    onSuccess: () => {
      if (typeof refetch === "function") {
        refetch();
      }
    },
  });

  const handlePostNote = () => {
    postNote.mutate({
      description: currentNote,
      workoutId,
      workoutSessionId,
    });
    setCurrentNote("");
  };
  return (
    <div>
      <textarea
        className="textarea-primary textarea mb-4 w-full"
        placeholder="Add note"
        value={currentNote}
        onChange={({ currentTarget }) => setCurrentNote(currentTarget.value)}
      ></textarea>
      <button onClick={handlePostNote} className="btn-primary btn-outline btn">
        Add note
      </button>
    </div>
  );
};
