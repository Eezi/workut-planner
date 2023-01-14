import { router } from "../trpc";
import { authRouter } from "./auth";
import { workoutRouter } from "./workout";

export const appRouter = router({
  workout: workoutRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
