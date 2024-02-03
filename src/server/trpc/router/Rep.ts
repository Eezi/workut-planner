import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const repRouter = router({
  editRep: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.rep.update({
          where: {
            id: input.id,
          },
          data: {
            done: input.done,
            amount: input.amount,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  createRep: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        workoutSessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.rep.create({
          data: {
              workoutId: input.workoutId,
              workoutSessionId: input.workoutSessionId,
              done: false,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  removeRep: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.rep.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
