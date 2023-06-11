import { AddSessionModal } from "./AddSessionModal";
import { Workout, Intensity } from "../types/workout";

const colors = new Map([
  ["HARD", "text-red-900"],
  ["MEDIUM", "text-amber-900"],
  ["EASY", "text-green-900"],
]);

const bgs = new Map([
  ["HARD", "bg-red-100"],
  ["MEDIUM", "bg-amber-100"],
  ["EASY", "bg-green-100"],
]);

interface Props {
  intensity: Intensity;
}

export const IntesityBadge = ({ intensity }: Props) => (
  <div
    className={`badge ${colors.get(intensity)} ${bgs.get(
      intensity
    )} p-3 font-semibold`}
  >
    {intensity}
  </div>
);

export const WorkoutCard = ({ title, description, intensity, id }: Workout) => {
  console.log('TITLE', title, 'ID', id)
  return (
    <div className="card bg-grey shadow-xl">
      <div className="card-body">
        <div className="flex flex-col gap-2">
          <h2 className="card-title text-white">{title}</h2>
          <div
            className={`badge ${colors.get(intensity)} ${bgs.get(
              intensity
            )} p-3 font-semibold`}
          >
            {intensity}
          </div>
        </div>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <AddSessionModal workoutId={id} />
        </div>
      </div>
    </div>
  );
};
