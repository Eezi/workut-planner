import { trpc } from "../../utils/trpc";
import { PageHead } from "../../components/Head";
import { PageTitle } from "../../components/PageTitle";
import { useRouter } from "next/router";
import PageTransition from "../../components/PageTransition";
import dayjs from "dayjs";

type PageProps = {};
const SessionNotes = (
  props: PageProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const { data: notes, isLoading } =
    trpc.workoutSession.getAllWorkoutNotes.useQuery({
      id: slug as string,
    });

  return (
    <PageTransition ref={ref}>
      <PageHead title="All Workouts" />
      <PageTitle title="Workout notes" />
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
                      {dayjs(session?.doneAt).format("DD.MM.YYYY")}
                    </time>
                  </div>
                  <div className="chat-bubble">{session.notes}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </PageTransition>
  );
};

export default SessionNotes;
