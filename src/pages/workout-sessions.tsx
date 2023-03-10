import { type NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import dayjs from "dayjs";

const WorkoutSessions: NextPage = () => {
  const { data: sessions, isLoading } =
    trpc.workoutSession.getAllWorkoutSessions.useQuery();
  const { data: sessionData } = useSession();
  const router = useRouter();
  const utils = trpc.useContext();
  console.log("sessions", sessions);

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  const markSessionDone = trpc.workoutSession.markSessionDone.useMutation({
    onMutate: () => {
      utils.workoutSession.getAllWorkoutSessions.cancel();
      const optimisticUpdate = utils.workoutSession.getAllWorkoutSessions.getData();

      if (optimisticUpdate) {
        utils.workoutSession.getAllWorkoutSessions.setData(
          () => {},
          optimisticUpdate
        );
      }
    },
    onSettled: () => {
      utils.workoutSession.getAllWorkoutSessions.invalidate();
    },
  });

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  const handleMarkDone = (sessionId: string, checked: boolean) => {
    markSessionDone.mutate({
      id: sessionId,
      done: checked,
    });
  };
  
  const allSessions = sessions?.sort((a, b) => {
    if (a.done === true) return 1;
    return Number(new Date(a.date)) - Number(new Date(b.date))
  } )
  return (
    <>
      <Head>
        <title>All Workouts</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {isLoading ? (
          <div>Fetching sessions...</div>
        ) : (
          <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
            <h4 className="text-2xl font-extrabold tracking-tight text-white sm:text-[3rem]">
              All Workout Sessions
            </h4>
            <div className="grid grid-cols-1 gap-4 md:gap-8">
              {allSessions?.map(({ date, workout, done, id }) => (
                <div
                  key={id}
                  className="flex rounded-xl items-center bg-base-100 gap-4 p-5 min-w-full"
                >
                  <div>
                    <input
                      type="checkbox"
                      className="checkbox-secondary checkbox"
                      defaultChecked={done}
                      onChange={({ target }) => handleMarkDone(id, target.checked)}
                    />
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span className="label-text text-xl text-white">{workout.title}</span>
                    <span className="text-gray-400">
                      {dayjs(date).format("dddd")} -{" "}
                      {dayjs(date).format("DD.MM.YYYY")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default WorkoutSessions;
