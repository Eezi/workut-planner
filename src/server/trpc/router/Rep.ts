import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { protectedProcedure, router } from "../trpc";

export const repRouter = router({
	editRep: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				done: z.boolean(),
				secoundsAmount: z.number().optional(),
				repsAmount: z.number().optional(),
				weightAmount: z.number().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.reps.editRep, {
					id: input.id as Id<"reps">,
					done: input.done,
					secoundsAmount: input.secoundsAmount,
					repsAmount: input.repsAmount,
					weightAmount: input.weightAmount,
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
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.reps.createRep, {
					workoutId: input.workoutId as Id<"workouts">,
					workoutSessionId: input.workoutSessionId as Id<"workoutSessions">,
				});
			} catch (error) {
				console.log(error);
			}
		}),
	removeRep: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.reps.removeRep, {
					id: input.id as Id<"reps">,
				});
			} catch (error) {
				console.log(error);
			}
		}),
});
