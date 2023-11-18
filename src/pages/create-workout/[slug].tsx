import { useEffect, useState } from "react";
import { type NextPage } from "next";
import { PageHead } from "../../components/Head";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Intensity } from "../../types/workout";
import { PageTitle } from "../../components/PageTitle";

const CREATE_MODE = "create";

const defaultLabels = [
  {
    label: "Boulder",
    key: "boulder",
  },
  {
    label: "Lead",
    key: "lead",
  },
  {
    label: "Supportive Training",
    key: "supportive-training",
  },
];

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
  };

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
      <PageTitle title="Create new workout" />
      <div className="flex flex-col gap-8 py-6">
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
          className="input-bordered input-primary input"
        />
        {errors.title && <span>{errors.title}</span>}
        <select
          onChange={(event) => setIntensity(event.target.value as Intensity)}
          className="select-primary select"
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
          className="textarea-primary textarea"
        />
        <button onClick={handleSubmit} className="btn-success btn">
          {isCreateForm ? "Create" : "Update"}
        </button>
      </div>
    </>
  );
};

export default AllWorkouts;
