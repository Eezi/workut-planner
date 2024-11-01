import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { PageHead } from "../../components/Head";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import PageTransition from "../../components/PageTransition";
import { DatePicker } from "../../components/Datepicker";
import { useState, useEffect, useMemo } from "react";
import { AddNotes } from "../../components/AddNotes";
import type { Workout, Rep } from "@prisma/client";
import { DoneRepsTable } from "../statistics";

type Props = {
  rep: Rep & { repCount: string };
  workout: Workout | undefined;
  setReps: React.Dispatch<React.SetStateAction<Rep[]>>;
};

const RepCheckbox = (props: Props) => {
  const validateAmount = z.number().nonnegative();
  const { rep, setReps, workout } = props;
  const { id, repCount } = rep;

  const editRep = trpc.rep.editRep.useMutation();
  const removeRep = trpc.rep.removeRep.useMutation();
  const [isDone, setIsDone] = useState(false);
  const [secoundsAmount, setSecondsAmount] = useState("");
  const [weightAmount, setWeightAmount] = useState("");
  const [repsAmount, setRepsAmount] = useState("");

  useEffect(() => {
    const { secoundsAmount, weightAmount, repsAmount, done } = rep;
    if (done !== null) {
      setIsDone(done);
    }
    if (weightAmount !== null) {
      setWeightAmount(weightAmount.toString() || "");
    }
    if (secoundsAmount !== null) {
      setSecondsAmount(secoundsAmount.toString() || "");
    }
    if (repsAmount !== null) {
      setRepsAmount(repsAmount.toString() || "");
    }
  }, [rep]);

  const handleEditRep = (checked: boolean) => {
    const newSecAmount =
      secoundsAmount === "" ? undefined : Number(secoundsAmount);
    const newWeightAmount =
      weightAmount === "" ? undefined : Number(weightAmount);
    const newRepsAmount = repsAmount === "" ? undefined : Number(repsAmount);
    validateAmount.safeParse(newSecAmount);
    validateAmount.safeParse(newWeightAmount);
    validateAmount.safeParse(newRepsAmount);
    setReps((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          return {
            ...rep,
            done: checked,
            secoundsAmount: newSecAmount || null,
            weightAmount: newWeightAmount || null,
            repsAmount: newRepsAmount || null,
          };
        }
        return rep;
      })
    );
    editRep.mutate({
      id,
      done: checked,
      secoundsAmount: newSecAmount,
      weightAmount: newWeightAmount,
      repsAmount: newRepsAmount,
    });
  };
  const handleRemoveRep = () => {
    setReps((prev) => prev.filter((rep) => rep.id !== id));
    removeRep.mutate({
      id,
    });
  };

  const { includeSeconds, includeWeight, includeReps } = workout || {};
  return (
    <tr>
      <th>
        <label className="flex gap-3">
          <p>{repCount}</p>
          <input
            type="checkbox"
            checked={isDone}
            disabled={!id}
            onChange={({ target }) => {
              setIsDone(target.checked);
              handleEditRep(target.checked);
            }}
            className="checkbox-primary checkbox"
          />
        </label>
      </th>
      <td>
        {includeWeight && (
          <input
            onBlur={() => handleEditRep(isDone)}
            value={weightAmount}
            disabled={!id}
            name="weightAmount"
            onChange={({ target }) => setWeightAmount(target.value)}
            className="input-bordered input input-sm w-14 "
          />
        )}
      </td>
      <td>
        {includeSeconds && (
          <input
            onBlur={() => handleEditRep(isDone)}
            value={secoundsAmount}
            name="secoundsAmount"
            disabled={!id}
            onChange={({ target }) => setSecondsAmount(target.value)}
            className="input-bordered input input-sm w-14 max-w-xs "
          />
        )}
      </td>
      <td>
        {includeReps && (
          <input
            onBlur={() => handleEditRep(isDone)}
            value={repsAmount}
            disabled={!id}
            name="repsAmount"
            onChange={({ target }) => setRepsAmount(target.value)}
            className="input-bordered input input-sm w-14 max-w-xs "
          />
        )}
      </td>
      <td>
        <button
          onClick={handleRemoveRep}
          disabled={!id}
          className="btn-outline btn btn-square btn-xs"
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
      </td>
    </tr>
  );
};

const RepsTable = ({
  reps,
  workout,
  setReps,
}: {
  reps: Rep[];
  workout: Workout | undefined;
  setReps: React.Dispatch<React.SetStateAction<Rep[]>>;
}) => {
  const { includeSeconds, includeReps, includeWeight } = workout || {};
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            {includeWeight && <th>Kg</th>}
            {includeSeconds && <th>Secounds</th>}
            {includeReps && <th>Reps</th>}
          </tr>
        </thead>
        <tbody>
          {reps.map((rep, index) => (
            <RepCheckbox
              setReps={setReps}
              key={rep.id}
              workout={workout}
              rep={{ ...rep, repCount: `${index + 1}` }}
            />
          ))}
        </tbody>
      </table>
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
  //TODO: Lisää seding field to reps when user remove or adds rep
  const [reps, setReps] = useState<Rep[]>([]);
  const [sessionDate, setSessionDate] = useState<Date>(
    session?.date || new Date()
  );
  const editSession = trpc.workoutSession.editSession.useMutation();
  const { data: latestSession } =
    trpc.workoutSession.fetchLatestDoneSession.useQuery({
      workoutId: session?.workoutId,
    });
  const createRep = trpc.rep.createRep.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const doneReps = latestSession?.reps?.filter(({ done: repDone }) => repDone);

  useEffect(() => {
    if (!isLoading && session && session?.reps?.length > 0) {
      setReps(session.reps);
    }
  }, [session, isLoading]);

  const handleCreateRep = () => {
    const newRep: Rep = {
      id: "",
      done: false,
      workoutId: session?.workoutId as string,
      secoundsAmount: null,
      weightAmount: null,
      repsAmount: null,
      workoutSessionId: session?.id as string,
    };
    setReps([...reps, newRep]);
    if (session) {
      createRep.mutate({
        workoutSessionId: session.id,
        workoutId: session.workoutId,
      });
    }
  };

  if (error) {
    <h1>Error happened :(</h1>;
  }

  const formattedText = useMemo(() => {
    return session?.workout?.description?.split("\n").join("<br />");
  }, [session?.workout?.description]);

  const handleUpdateDate = (newDate: Date) => {
    setSessionDate(new Date(newDate));
    if (session?.id) {
      editSession.mutate({
        id: session?.id,
        date: new Date(newDate),
      });
    }
  };

  return (
    <PageTransition ref={ref}>
      <PageHead title="Session" />
      {isLoading ? (
        <div>Fetching session...</div>
      ) : (
        <div className="mb-16">
          <h1 className="mb-2 text-xl font-bold">{session?.workout?.title}</h1>
          {latestSession && (
            <div className="text-slate-400">
              Last done - {dayjs(latestSession?.doneAt).format("DD.MM.YYYY")}
            </div>
          )}
          <DoneRepsTable doneReps={doneReps as Rep[]} />
          <p className="my-3  max-w-[45ch] text-xl">
            <div
              dangerouslySetInnerHTML={{ __html: formattedText as string }}
            />
          </p>
          <div className="mt-1">
            <DatePicker date={sessionDate} setDate={handleUpdateDate} />
          </div>
          <h5 className="my-4 text-base font-bold">Reps</h5>
          <RepsTable reps={reps} workout={session?.workout} setReps={setReps} />
          {/*<div className="grid gap-4 pb-5">
            {reps.map((rep, index) => (
              <RepCheckbox
                rep={{ ...rep, repCount: `${index + 1}` }}
                workout={session?.workout}
                setReps={setReps}
                key={rep.id}
              />
            ))}
            </div>*/}
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
