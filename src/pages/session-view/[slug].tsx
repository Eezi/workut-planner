import { trpc } from "../../utils/trpc";
import { PageHead } from "../../components/Head";
import { PageTitle } from "../../components/PageTitle";
import { useRouter } from "next/router";
import PageTransition from "../../components/PageTransition";
import { DateInput } from "../../components/DateInput";
import { useState, useEffect } from "react";
import { AddNotes } from "../../components/AddNotes";

type Rep = {
  amount: number | null;
  id: string;
  workoutId: string;
  workoutSessionId: string | null;
  done: boolean;
};

type Props = {
  rep: Rep & { repCount: string };
  setReps: React.Dispatch<React.SetStateAction<Rep[]>>;
};

const RepCheckbox = (props: Props) => {
  const { rep, setReps } = props;
  const { id, repCount } = rep;

  const editRep = trpc.rep.editRep.useMutation();
  const removeRep = trpc.rep.removeRep.useMutation();
  const [isDone, setIsDone] = useState(false);
  const [currentAmount, setCurrentAmount] = useState("");

  useEffect(() => {
    if (rep.done !== null) {
      setIsDone(rep.done);
    }
    if (rep.amount !== null) {
      setCurrentAmount(rep.amount.toString());
    }
  }, [rep.done, rep.amount]);

  const handleEditRep = (checked: boolean) => {
    editRep.mutate({
      id,
      done: checked,
      amount: Number(currentAmount),
    });
    setReps((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          return {
            ...rep,
            done: checked,
            amount: Number(currentAmount),
          };
        }
        return rep;
      })
    );
  };
  const handleRemoveRep = () => {
    removeRep.mutate({
      id,
    });
    setReps((prev) => prev.filter((rep) => rep.id !== id));
  };

  return (
    <div className="flex items-center gap-4">
      <div>
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            checked={isDone}
            onChange={({ target }) => {
              setIsDone(target.checked);
              handleEditRep(target.checked);
            }}
            className="checkbox-primary checkbox"
          />
        </label>
      </div>
      <div>
        <label className="form-control w-full max-w-xs">
          <input
            type="number"
            placeholder="Amount"
            onBlur={() => handleEditRep(isDone)}
            value={currentAmount}
            onChange={({ target }) => setCurrentAmount(target.value)}
            className="input-bordered input-primary input input-sm w-full max-w-xs "
          />
        </label>
      </div>
      <div>
        <button
          onClick={handleRemoveRep}
          className="btn-outline btn-sm btn-square btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

type PageProps = {};
const SessionNotes = (
  props: PageProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const {
    data: session,
    error,
    isLoading,
    refetch,
  } = trpc.workoutSession.sessionById.useQuery({
    id: slug as string,
  });
  const [reps, setReps] = useState<Rep[]>([]);
  const editSession = trpc.workoutSession.editSession.useMutation();
  const createRep = trpc.rep.createRep.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (!isLoading && session && session?.reps?.length > 0) {
      setReps(session.reps);
    }
  }, [session, isLoading]);

  const handleEditSession = (sessionId: string | undefined, date: Date) => {
    if (sessionId) {
      editSession.mutate({
        id: sessionId,
        date,
      });
    }
  };

  const handleCreateRep = () => {
    if (session) {
      createRep.mutate({
        workoutSessionId: session.id,
        workoutId: session.workoutId,
      });
      refetch();
    }
  };

  if (error) {
    <h1>Tapahtui virhe :(</h1>;
  }

  return (
    <PageTransition ref={ref}>
      <PageHead title="Session" />
      <PageTitle title="Session view" />
      {isLoading ? (
        <div>Fetching session...</div>
      ) : (
        <div className="mb-16">
          <h1 className="mb-4 text-2xl font-bold">{session?.workout?.title}</h1>
          <p className="mb-6 max-w-[45ch] text-xl">
            {session?.workout?.description}
          </p>
          <div className="mt-1">
            <DateInput
              date={session?.date || new Date()}
              setDate={(date: Date) => {
                handleEditSession(session?.id, date);
              }}
            />
          </div>
          <h5 className="my-4 text-xl font-bold">Reps</h5>
          <div className="grid gap-4 pb-5">
            {reps.map((rep, index) => (
              <RepCheckbox
                rep={{ ...rep, repCount: `${index + 1}` }}
                setReps={setReps}
                key={rep.id}
              />
            ))}
          </div>
          <div className="mb-6">
            <button onClick={handleCreateRep} className="btn-neutral btn">
              Create rep
            </button>
          </div>
          <div>
            <AddNotes
              workoutId={session?.workoutId as string}
              workoutSessionId={session?.id as string}
            />
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default SessionNotes;
