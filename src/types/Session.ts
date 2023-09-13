import { Workout } from "./workout";

export interface Session {
  id: string;
  date: Date;
  workout: Workout;
  done: boolean;
  notes?: string;
}
