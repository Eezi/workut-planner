import React, { useEffect, useState } from "react";
import { type NextPage } from "next";
import { PageHead } from "../../components/Head";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PageTitle } from "../../components/PageTitle";
import PageTransition from "../../components/PageTransition";

const CREATE_MODE = "create";

const UnitCheckbox = ({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (newValue: boolean) => void;
  label: string;
}) => {
  return (
    <div className="form-control mb-2">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={({ currentTarget }) => onChange(currentTarget.checked)}
          className="checkbox-primary checkbox"
        />
      </label>
    </div>
  );
};

type PageProps = {};
const AllWorkouts: NextPage = (
  props: PageProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [numberOfReps, setNumberOfReps] = useState("");
  const [includeSeconds, setIncludeSeconds] = useState(true);
  const [includeWeight, setIncludeWeight] = useState(true);
  const [includeReps, setIncludeReps] = useState(false);
  const [intensity, setIntensity] = useState<string>("MEDIUM");
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
      const { title, description, intensity, reps } = workout;
      setTitle(title);
      setDescription(description || "");
      setIntensity(intensity);
      setNumberOfReps(reps ? reps.toString() : "");
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
      reps: Number(numberOfReps),
      intensity: intensity,
      userId: sessionData?.user?.id || "",
      includeSeconds,
      includeWeight,
      includeReps,
    });
  };

  const updateWorkout = async () => {
    if (workout) {
      editWorkout.mutate({
        id: workout.id,
        title,
        description,
        reps: Number(numberOfReps),
        intensity: intensity,
        includeSeconds,
        includeWeight,
        includeReps,
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
    <PageTransition ref={ref}>
      <PageHead title="Create Workout" />
      <PageTitle title="Create new workout" />
      <div className="mt-5 flex flex-col gap-6 pb-20">
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
          onChange={(event) => setIntensity(event.target.value)}
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
        <input
          type="number"
          value={numberOfReps}
          placeholder="Set number of reps"
          required
          minLength={1}
          maxLength={2}
          onChange={(event) => {
            setNumberOfReps(event.target.value);
          }}
          className="input-bordered input-primary input"
        />
        <div>
          <UnitCheckbox
            value={includeSeconds}
            onChange={(newValue: boolean) => setIncludeSeconds(newValue)}
            label="Add secounds"
          />
          <UnitCheckbox
            label="Add kg"
            value={includeWeight}
            onChange={(newValue: boolean) => setIncludeWeight(newValue)}
          />
          <UnitCheckbox
            label="Add reps"
            value={includeReps}
            onChange={(newValue: boolean) => setIncludeReps(newValue)}
          />
        </div>

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
    </PageTransition>
  );
};

export default AllWorkouts;
