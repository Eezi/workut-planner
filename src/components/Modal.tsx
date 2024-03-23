import { Workout } from "../types/workout";
import { IntesityBadge } from "./workoutCard";

type Props = Pick<Workout, "title" | "description" | "intensity">;

const FormatLongString = ({ text }: { text: string | null | undefined }) => {
  if (!text) return null;

  const formatString = () => {
    // Replace line breaks with HTML line break tags
    const formattedString = text.replace(/\n/g, "<br>");

    return formattedString;
  };

  const formattedString = formatString();

  return (
    <div
      className="mt-4 text-base leading-relaxed text-gray-200"
      dangerouslySetInnerHTML={{ __html: formattedString }}
    ></div>
  );
};

export const WorkoutModalContent = ({
  title,
  description,
  intensity,
}: Props) => (
  <div>
    <p className="mt-2 mb-2 text-xl font-semibold leading-none tracking-tighter text-white lg:text-3xl">
      {title}
    </p>
    <IntesityBadge intensity={intensity} />
    <div className="max-h-72 overflow-y-auto">
      <FormatLongString text={description} />
    </div>
  </div>
);
