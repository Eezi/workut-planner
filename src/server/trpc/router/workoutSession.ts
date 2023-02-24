import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const workoutSessionRouter = router({
  postWorkoutSession: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(), 
        date: z.date(),
        userId: z.string(),
        done: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workoutSession.create({
          data: {
            workoutId: input.workoutId,
            date: input.date,
            userId: input.userId,
            done: input.done,
            createdAt: new Date(),
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  // Later we can change this to publicProcedure to see other user's workouts
  getAllWorkoutSessions: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.workoutSession.findMany({
        where: { userId: ctx.session.user.id },
        select: {
            workoutId: true,
            date: true,
            userId: true,
            done: true,
            createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
});
