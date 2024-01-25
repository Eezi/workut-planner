import { trpc } from "../../utils/trpc";
import { PageHead } from "../../components/Head";
import { PageTitle } from "../../components/PageTitle";
import { useRouter } from "next/router";
import PageTransition from "../../components/PageTransition";
import dayjs from "dayjs";
import { useState } from "react";

type PageProps = {};
const SessionNotes = (
  props: PageProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [currentNote, setCurrentNote] = useState("");
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const { data: notes, isLoading } = trpc.note.getAllWorkoutNotes.useQuery({
    workoutId: slug as string,
  });

  const postNote = trpc.note.postNote.useMutation();

  const handlePostNote = () => {
    console.log("cuttent note", currentNote);
    /* postNote({
      description: currentNote,
      workoutId: slug,
    }); */
  };

  return (
    <PageTransition ref={ref}>
      <PageHead title="All Workouts" />
      <PageTitle title="Workout notes" />
      <div className="relative min-h-[70vh]">
        {/* isLoading ? (
          <div>Fetching notes...</div>
        ) : (
          <div>
            {notes && notes.length <= 0 ? (
              <h2>no notes yet</h2>
            ) : (
              <>
                {notes?.map((session) => (
                  <div key={session.id} className="chat chat-start">
                    <div className="chat-header">
                      <time className="text-xs opacity-50">
                        {dayjs(session?.doneAt).format("DD.MM.YYYY")}
                      </time>
                    </div>
                    <div className="chat-bubble">{session.notes}</div>
                  </div>
                ))}
              </>
            )}
            <div className="fixed bottom-0 w-full">
              <div className="flex items-center gap-8">
                <textarea
                  className="textarea-primary textarea w-full"
                  placeholder="Add note"
                  value={currentNote}
                  onChange={({ currentTarget }) =>
                    setCurrentNote(currentTarget.value)
                  }
                ></textarea>
                <button onClick={handlePostNote} className="btn-primary btn">
                  Tallenna
                </button>
              </div>
            </div>
          </div>
                )*/}
      </div>
    </PageTransition>
  );
};

export default SessionNotes;
