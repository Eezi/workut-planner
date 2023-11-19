import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface WorkoutSessionData {
  title: string;
  _id: string;
  count: number;
}

export const RadarChart = ({
  workoutSessions,
}: {
  workoutSessions: WorkoutSessionData[];
}) => {
  const sessionLabels = workoutSessions.map(({ title }) => title);
  const sessionData = workoutSessions.map(({ count, title }) => ({
    label: title,
    data: count,
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgba(255, 99, 132, 1)",
    borderWidth: 1,
  }));

  const data = {
    labels: sessionLabels,
    datasets: sessionData,
  };

  return <Radar data={data} />;
};
