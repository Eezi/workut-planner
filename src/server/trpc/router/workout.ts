import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const workoutRouter = router({
  postWorkout: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        userId: z.string(),
        intensity: z.enum(['HARD', 'MEDIUM', 'EASY']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workout.create({
          data: {
            title: input.title,
            description: input.description,
            intensity: input.intensity,
            userId: input.userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  // Later we can change this to publicProcedure to see other user's workouts
  getAllWorkouts: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.workout.findMany({
        where: { userId: ctx.session.user.id },
        select: {
          title: true,
          description: true,
          intensity: true,
          userId: true,
          id: true,
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
