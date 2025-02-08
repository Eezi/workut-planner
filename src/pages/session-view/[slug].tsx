import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { PageHead } from "../../components/Head";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import PageTransition from "../../components/PageTransition";
import { DatePicker } from "../../components/Datepicker";
import { useState, useEffect, useMemo } from "react";
import { AddNotes } from "../../components/AddNotes";
import type { Workout, Rep, Session, WorkoutSession } from "@prisma/client";
import { DoneRepsTable } from "../statistics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type Props = {
  rep: Rep | undefined;
  workout: Workout | undefined;
  refetch: any;
};

const RepCheckbox = (props: Props) => {
  const validateAmount = z.number().nonnegative();
  const { rep, workout, refetch } = props;
  const { id } = rep || {};

  const utils = trpc.useContext();
  const router = useRouter();
  const {
    query: { slug },
  } = router;

  const editRep = trpc.rep.editRep.useMutation({
    onMutate: async (newEntry: any) => {
      await utils.workoutSession.sessionById.cancel();
      utils.workoutSession.sessionById.setData(
        { id: slug as string },
        (prevEntries: any) => {
          if (prevEntries && newEntry) {
            const newData = {
              ...prevEntries,
              reps: prevEntries?.reps?.map((item: any) => {
                if (item.id === newEntry.id) {
                  return newEntry;
                }
                return item;
              }),
            };
            return newData;
          }
        }
      );
    },
    onSettled: async () => {
      await utils.workoutSession.sessionById.invalidate();
    },
  });
  const removeRep = trpc.rep.removeRep.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const [initialDataSetted, setInitialDataSetted] = useState(false);
  const [fields, setFields] = useState({
    secoundsAmount: "",
    weightAmount: "",
    repsAmount: "",
    done: false,
  });

  useEffect(() => {
    if (rep && !initialDataSetted) {
      const { secoundsAmount, weightAmount, repsAmount, done } = rep;
      setFields({
        weightAmount: weightAmount ? weightAmount.toString() : "",
        secoundsAmount: secoundsAmount ? secoundsAmount.toString() : "",
        repsAmount: repsAmount ? repsAmount.toString() : "",
        done,
      });
      setInitialDataSetted(true);
    }
  }, [rep, initialDataSetted]);

  const handleFieldValue = (value: string | boolean) => {
    if (value === "") return undefined;
    return Number(value);
  };

  const handleEditRep = (
    key: "done" | "secoundsAmount" | "weightAmount" | "repsAmount",
    value: string | boolean
  ) => {
    const updatedFields = {
      ...fields,
      secoundsAmount: fields.secoundsAmount
        ? Number(fields.secoundsAmount)
        : undefined,
      weightAmount: fields.weightAmount
        ? Number(fields.weightAmount)
        : undefined,
      repsAmount: fields.repsAmount ? Number(fields.repsAmount) : undefined,
      [key]: key === "done" ? Boolean(value) : handleFieldValue(value),
    };

    Object.values(updatedFields).forEach((amount) =>
      validateAmount.safeParse(amount)
    );

    if (id) {
      editRep.mutate({
        id,
        ...updatedFields,
      });
    }
  };

  const handleRemoveRep = async () => {
    if (id) {
      removeRep.mutate({
        id,
      });
    }
  };

  const { includeSeconds, includeWeight, includeReps } = workout || {};
  return (
    <TableRow>
      <TableCell className="w-12">
        <Checkbox
          className="mb-2.5 ml-2"
          checked={fields.done}
          disabled={!id}
          onCheckedChange={(newValue) => {
            setFields({ ...fields, done: newValue as boolean });
            handleEditRep("done", newValue);
          }}
        />
      </TableCell>
      {includeWeight && (
        <TableCell>
          <Input
            onBlur={({ target }) => handleEditRep("weightAmount", target.value)}
            value={fields.weightAmount}
            disabled={!id}
            name="weightAmount"
            onChange={({ target }) =>
              setFields({ ...fields, weightAmount: target.value })
            }
            className="h-8 w-14"
          />
        </TableCell>
      )}
      {includeSeconds && (
        <TableCell>
          <Input
            onBlur={({ target }) =>
              handleEditRep("secoundsAmount", target.value)
            }
            value={fields.secoundsAmount}
            name="secoundsAmount"
            disabled={!id}
            onChange={({ target }) =>
              setFields({ ...fields, secoundsAmount: target.value })
            }
            className="h-8 w-14 max-w-xs"
          />
        </TableCell>
      )}
      {includeReps && (
        <TableCell>
          <Input
            onBlur={({ target }) => handleEditRep("repsAmount", target.value)}
            value={fields.repsAmount}
            disabled={!id}
            name="repsAmount"
            onChange={({ target }) =>
              setFields({ ...fields, repsAmount: target.value })
            }
            className="w-14 max-w-xs "
          />
        </TableCell>
      )}
      <TableCell>
        <button
          onClick={handleRemoveRep}
          disabled={!id}
          className="rounded-md border border-solid p-[0.3rem]"
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
      </TableCell>
    </TableRow>
  );
};

const RepsTable = ({
  reps,
  workout,
  refetch,
}: {
  reps: Rep[] | undefined;
  workout: Workout | undefined;
  refetch: any;
}) => {
  const { includeSeconds, includeReps, includeWeight } = workout || {};
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{""}</TableHead>
            {includeWeight && <TableHead>Kg</TableHead>}
            {includeSeconds && <TableHead>Secounds</TableHead>}
            {includeReps && <TableHead>Reps</TableHead>}
            <TableHead>{""}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reps?.map((rep) => (
            <RepCheckbox
              key={rep.id}
              refetch={refetch}
              workout={workout}
              rep={rep}
            />
          ))}
        </TableBody>
      </Table>
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

  const handleCreateRep = () => {
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
            <div className="text-sm text-slate-400">
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
          <RepsTable
            refetch={refetch}
            reps={session?.reps}
            workout={session?.workout}
          />
          <div className="mb-6">
            <Button variant="outline" onClick={handleCreateRep}>
              Create rep
            </Button>
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
