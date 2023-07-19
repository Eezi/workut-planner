import { Workout } from "../types/workout";
import { IntesityBadge } from "./workoutCard";

type Props = Pick<Workout, "title" | "description" |"intensity">;

export const WorkoutModalContent = ({
  title,
  description,
  intensity,
}: Props) => (
  <div>
    <p className="mt-8 mb-4 text-2xl font-semibold leading-none tracking-tighter text-white lg:text-3xl">
      {title}
    </p>
    <IntesityBadge intensity={intensity} />
    <p className="mt-4 text-xl leading-relaxed text-gray-200">
      {description}
    </p>
    <div className="mt-6 w-full">
      {/*<a
        className="flex w-full transform items-center justify-center rounded-xl bg-indigo-600 pt-4 pr-10 pb-4
                    pl-10 text-center text-base font-medium text-white transition duration-500 ease-in-out
                    hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Update
</a>*/}
    </div>
  </div>
);
