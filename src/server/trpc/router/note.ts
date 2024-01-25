
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const noteRouter = router({
  postNote: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        workoutId: z.string(),
        workoutSessionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const created = await ctx.prisma.note.create({
          data: {
            workoutId: input.workoutId,
            workoutSessionId: input.workoutSessionId || null,
            userId: ctx.session.user.id,
            description: input.description,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return created
      } catch (error) {
        console.log(error);
      }
    }),

  /*editNote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workoutSession.update({
          where: {
            id: input.id,
          },
          data: {
            notes: input.notes,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }), */

    getAllWorkoutNotes: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.note.findMany({
          where: {
            workoutId: input.workoutId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
