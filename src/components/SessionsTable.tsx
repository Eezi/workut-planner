import dayjs from "dayjs";
import { sliceLongText } from "../utils/sliceLongText";
import { WorkoutSession } from "@prisma/client";

export interface WorkoutSessionData {
  title: string;
  _id: string;
  count: number;
  latestSession: WorkoutSession;
}
export const SessionsTable = ({
  sessionData,
}: {
  sessionData: WorkoutSessionData[];
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-zebra table-md table">
        <thead>
          <tr>
            <th>Workout name</th>
            <th>Sessions</th>
            <th>Latest session</th>
          </tr>
        </thead>
        <tbody>
          {sessionData.map(({ title, _id, count, latestSession }) => (
            <tr key={_id}>
              <td>{sliceLongText(title)}</td>
              <td>{count}</td>
              <td>{dayjs(latestSession?.date).format("DD.MM.YYYY")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
