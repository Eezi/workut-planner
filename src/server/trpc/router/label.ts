import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const workoutRouter = router({
  /*postLabel: protectedProcedure
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
  getAllLabels: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.label.findMany({
        where: { userId: ctx.session.user.id },
        select: {
          label: true,
          key: true,
          userId: true,
          isDefaultLabel: true,
          id: true,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),

  removeLabel: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workout.delete({
          where: {
            id: input.id,
          },
        });

        await ctx.prisma.workoutSession.deleteMany({
          where: {
            workoutId: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  editLabel: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        intensity: z.enum(['HARD', 'MEDIUM', 'EASY']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workout.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            description: input.description,
            intensity: input.intensity,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),*/
});
