import { router } from "../trpc";
import { authRouter } from "./auth";
import { workoutRouter } from "./workout";
import { workoutSessionRouter } from "./workoutSession";
import { repRouter } from "./Rep";
import { noteRouter } from "./note";

export const appRouter = router({
  workout: workoutRouter,
  workoutSession: workoutSessionRouter,
  rep: repRouter,
  auth: authRouter,
  note: noteRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
