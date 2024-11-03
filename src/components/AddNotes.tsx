import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

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
      <Textarea
        className="mb-4 w-full"
        placeholder="Add note"
        value={currentNote}
        onChange={({ currentTarget }) => setCurrentNote(currentTarget.value)}
      />
      <Button variant="outline" onClick={handlePostNote}>
        Add note
      </Button>
    </div>
  );
};
