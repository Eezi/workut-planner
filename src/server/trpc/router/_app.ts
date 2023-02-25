import { router } from "../trpc";
import { authRouter } from "./auth";
import { workoutRouter } from "./workout";
import { workoutSessionRouter } from "./workoutSession";

export const appRouter = router({
  workout: workoutRouter,
  workoutSession: workoutSessionRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
