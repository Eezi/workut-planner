import { useState, useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Intensity } from "../types/workout";

const AllWorkouts: NextPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("MEDIUM");
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();
  const postWorkout = trpc.workout.postWorkout.useMutation({
    onMutate: () => {
      utils.workout.getAllWorkouts.cancel();
      const optimisticUpdate = utils.workout.getAllWorkouts.getData();

      if (optimisticUpdate) {
        /*utils.workout.getAllWorkouts.setData(
          "getAllWorkouts",
          optimisticUpdate
        );*/
      }
    },
    onSettled: () => {
      utils.workout.getAllWorkouts.invalidate();
    },
  });

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  const handleSubmit = () => {
    postWorkout.mutate({
      title,
      description,
      intensity: intensity,
      userId: sessionData?.user?.id || '',
    });
    setTitle("");
    setDescription("");
    router.push("/allworkouts");
  };

  return (
    <>
      <Head>
        <title>Create Workouts</title>
        <meta name="description" content="Create new workout" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h5 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create new workout
        </h5>
        <div className="container flex flex-col items-center gap-8 justify-center py-16 text-white">
          <input
            type="text"
            value={title}
            placeholder="Your workout name..."
            minLength={2}
            maxLength={100}
            onChange={(event) => setTitle(event.target.value)}
            className="input-bordered input-primary input w-full max-w-xs"
          />

          <select
            onChange={(event) => setIntensity(event.target.value as Intensity)}
            className="select-primary select w-full max-w-xs"
            value={intensity}
          >
            <option disabled selected>
              Intesity of workout
            </option>
            <option value="HARD">Hard</option>
            <option value="MEDIUM">Medium</option>
            <option value="EASY">Easy</option>
          </select>

          <textarea
            //type="text"
            value={description}
            rows={4}
            placeholder="Description..."
            maxLength={100}
            onChange={(event) => setDescription(event.target.value)}
            className="textarea-primary textarea w-80"
          ></textarea>
          <button onClick={handleSubmit} className="btn-accent btn">
            Create
          </button>
        </div>
      </main>
    </>
  );
};

export default AllWorkouts;
