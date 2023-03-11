import { AddSessionModal } from "./AddSessionModal";

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

export const WorkoutCard = ({ title, description, intensity, id }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title">{title}</h2>
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
          <AddSessionModal workoutId={id}  />
        </div>
      </div>
    </div>
  );
};
