import { trpc } from "../../utils/trpc";
import { PageHead } from "../../components/Head";
import { PageTitle } from "../../components/PageTitle";
import { useRouter } from "next/router";
import PageTransition from "../../components/PageTransition";
import dayjs from "dayjs";
import { useState } from "react";
import { AddNotes } from "../../components/AddNotes";

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
  const {
    data: notes,
    isLoading,
    refetch,
  } = trpc.note.getAllWorkoutNotes.useQuery({
    workoutId: slug as string,
  });

  const postNote = trpc.note.postNote.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handlePostNote = () => {
    postNote.mutate({
      description: currentNote,
      workoutId: slug as string,
    });
    setCurrentNote("");
  };

  return (
    <PageTransition ref={ref}>
      <PageHead title="All Workouts" />
      <PageTitle title="Workout notes" />
      <div className="relative min-h-[70vh]">
        {isLoading ? (
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
                        {dayjs(session?.createdAt).format("DD.MM.YYYY")}
                      </time>
                    </div>
                    <div className="chat-bubble">{session.description}</div>
                  </div>
                ))}
              </>
            )}
            <div className="absolute bottom-0 w-full">
              <AddNotes refetch={refetch} workoutId={slug as string} />
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default SessionNotes;
