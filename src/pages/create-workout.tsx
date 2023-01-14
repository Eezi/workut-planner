import { useState } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useRouter } from 'next/router';

const AllWorkouts: NextPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const utils = trpc.useContext();
  const postWorkout  = trpc.workout.postWorkout.useMutation({
    onMutate: () => {
      utils.workout.getAllWorkouts.cancel();
      const optimisticUpdate = utils.workout.getAllWorkouts.getData();

      if (optimisticUpdate) {
        utils.workout.getAllWorkouts.setData(optimisticUpdate);
      }
    },    
    onSettled: () => {
        utils.workout.getAllWorkouts.invalidate();
    },
  });

  return (
    <>
      <Head>
        <title>Create Workouts</title>
        <meta name="description" content="Create new workout" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create new workouts
          </h1>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              postWorkout.mutate({
                title,
                description,
                intensity: 'MEDIUM'
              });
              setTitle("");
              setDescription("");
              router.push('/allworkouts');
            }}
          >
            <input
              type="text"
              value={title}
              placeholder="Your workout name..."
              minLength={2}
              maxLength={100}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
            />

            <textarea
              type="text"
              value={description}
              rows="4"
              placeholder="Description..."
              maxLength={100}
              onChange={(event) => setDescription(event.target.value)}
              className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
            ></textarea>
            <button
              type="submit"
              className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
            >
              Create
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default AllWorkouts;
