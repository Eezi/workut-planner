import dayjs from "dayjs";
import { sliceLongText } from "../utils/sliceLongText";
import { WorkoutSession } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface WorkoutSessionData {
  title: string;
  id: string;
  count: number;
  latestSession: WorkoutSession;
}
export const SessionsTable = ({
  sessionData,
}: {
  sessionData: WorkoutSessionData[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workout name</TableHead>
          <TableHead>Sessions</TableHead>
          <TableHead>Latest session</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessionData.map(({ title, id, count, latestSession }) => (
          <TableRow key={id}>
            <TableCell>{sliceLongText(title)}</TableCell>
            <TableCell>{count}</TableCell>
            <TableCell>
              {dayjs(latestSession?.date).format("DD.MM.YYYY")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
