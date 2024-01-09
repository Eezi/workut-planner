import { trpc } from "../../utils/trpc";
import { PageHead } from "../../components/Head";
import { PageTitle } from "../../components/PageTitle";
import { useRouter } from "next/router";
import PageTransition from "../../components/PageTransition";
import dayjs from "dayjs";
import { useState } from "react";

type Rep = {
  amount: number | null;
  title: string;
  id: string;
  workoutId: string;
  workoutSessionId: string | null;
  done: boolean;
};

const RepCheckbox = ({ rep }: { rep: Rep }) => {
  const { title, id, amount, done } = rep;
  const utils = trpc.useContext();
  const editRep = trpc.rep.editRep.useMutation();
  const [isDone, setIsDone] = useState(done);
  const [currentAmount, setCurrentAmount] = useState(amount || "");

  const handleEditRep = () => {
    editRep.mutate({
      id,
      done: isDone,
      amount: Number(currentAmount),
    });
  };
  return (
    <div className="flex items-center gap-4">
      <div>
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            checked={isDone}
            onChange={({ target }) => setIsDone(target.checked)}
            onBlur={handleEditRep}
            className="checkbox-primary checkbox mr-4"
          />
          <span className="label-text text-xl">{title}</span>
        </label>
      </div>
      <div>
        <label className="form-control w-full max-w-xs">
          <input
            type="number"
            placeholder="Amount"
            onBlur={handleEditRep}
            value={currentAmount}
            onChange={({ target }) => setCurrentAmount(target.value)}
            className="input-bordered input-primary input input-sm w-full max-w-xs "
          />
        </label>
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
  const { data: session, isLoading } = trpc.workoutSession.sessionById.useQuery(
    {
      id: slug as string,
    }
  );
  console.log("data", session);

  return (
    <PageTransition ref={ref}>
      <PageHead title="Session" />
      <PageTitle title="Session view" />
      {isLoading ? (
        <div>Fetching session...</div>
      ) : (
        <div>
          <h1 className="mb-4 text-2xl font-bold">{session?.workout?.title}</h1>
          <p className="text-xl">{session?.workout?.description}</p>
          <div className="mt-8 grid gap-8">
            {session?.reps?.map((rep, index) => (
              <RepCheckbox
                rep={{ ...rep, title: `Rep ${index + 1}` }}
                key={rep.id}
              />
            ))}
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default SessionNotes;
