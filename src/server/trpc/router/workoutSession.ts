import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const workoutSessionRouter = router({
  postWorkoutSession: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        date: z.date(),
        userId: z.string(),
        done: z.boolean(),
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

  markSessionDone: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const doneAt = input.done === true ? new Date() : null;
      try {
        await ctx.prisma.workoutSession.update({
          where: {
            id: input.id,
          },
          data: {
            done: input.done,
            doneAt,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  removeSession: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workoutSession.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  editSession: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workoutSession.update({
          where: {
            id: input.id,
          },
          data: {
            date: input.date,
            notes: input.notes,
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
        include: {
          workout: true,
        },
        orderBy: {
          done: "asc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
});
