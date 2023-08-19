import { useEffect, useState } from "react";
import { type NextPage } from "next";
import { PageHead } from "../../components/Head";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Intensity } from "../../types/workout";

const CREATE_MODE = "create";

const AllWorkouts: NextPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("MEDIUM");
  const [errors, setErrors] = useState<{ title: string | null }>({
    title: null,
  });
  const router = useRouter();
  const utils = trpc.useContext();
  const {
    query: { slug },
  } = router;
  const { data: workout, isLoading } = trpc.workout.workoutById.useQuery({
    id: slug as string,
  });

  const isCreateForm = slug === CREATE_MODE;

  useEffect(() => {
    if (!isLoading && workout) {
      const { title, description, intensity } = workout;
      setTitle(title);
      setDescription(description || "");
      setIntensity(intensity);
    }
  }, [isLoading, workout]);

  const { data: sessionData } = useSession();

  const postWorkout = trpc.workout.postWorkout.useMutation({
    onMutate: () => {
      utils.workout.getAllWorkouts.cancel();
    },
    onSettled: () => {
      utils.workout.getAllWorkouts.invalidate();
    },
  });

  const editWorkout = trpc.workout.editWorkout.useMutation({
    onMutate: () => {
      utils.workout.getAllWorkouts.cancel();
    },
    onSettled: () => {
      utils.workout.getAllWorkouts.invalidate();
    },
  });

  const createWorkout = async () => {
    postWorkout.mutate({
      title,
      description,
      intensity: intensity,
      userId: sessionData?.user?.id || "",
    });
  };

  const updateWorkout = async () => {
    if (workout) {
      editWorkout.mutate({
        id: workout.id,
        title,
        description,
        intensity: intensity,
      });
    }
  };

  const handleResetForm = () => {
    setTitle("");
    setDescription("");
    router.push("/allworkouts");
  }

  const handleSubmit = async () => {
    if (!title) {
      return setErrors({ title: "Workout title is missing" });
    }

    if (isCreateForm) {
      await createWorkout();
    } else {
      await updateWorkout();
    }
    handleResetForm();
  };

  return (
    <>
      <PageHead title="Create Workout" />
      <main
        className="flex min-h-screen flex-col items-center justify-center"
        data-theme="nightforest"
      >
        <h5 className="text-center text-4xl font-extrabold tracking-tight text-white md:text-5xl ">
          Create new workout
        </h5>
        <div className="container flex flex-col items-center justify-center gap-8 py-16 text-white">
          <div className="w-full text-center">
            <input
              type="text"
              value={title}
              placeholder="Your workout name..."
              required
              minLength={2}
              maxLength={200}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrors({ title: null });
              }}
              className="input-bordered input-primary input w-full max-w-xs"
            />
            {errors.title && <span>{errors.title}</span>}
          </div>
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
            value={description}
            rows={4}
            placeholder="Description..."
            onChange={(event) => setDescription(event.target.value)}
            className="textarea-primary textarea w-80"
          ></textarea>
          <button onClick={handleSubmit} className="btn-success btn">
            {isCreateForm ? "Create" : "Update"}
          </button>
        </div>
      </main>
    </>
  );
};

export default AllWorkouts;
