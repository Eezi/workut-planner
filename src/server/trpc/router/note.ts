import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { protectedProcedure, router } from "../trpc";
import { mapNote } from "./_map";

export const noteRouter = router({
	postNote: protectedProcedure
		.input(
			z.object({
				description: z.string(),
				workoutId: z.string(),
				workoutSessionId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const created = await ctx.convex.mutation(api.notes.postNote, {
					description: input.description,
					workoutId: input.workoutId as Id<"workouts">,
					workoutSessionId: input.workoutSessionId
						? (input.workoutSessionId as Id<"workoutSessions">)
						: undefined,
					userId: ctx.session.user.id,
				});
				return mapNote(created);
			} catch (error) {
				console.log(error);
			}
		}),

	getAllWorkoutNotes: protectedProcedure
		.input(z.object({ workoutId: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const notes = await ctx.convex.query(api.notes.getAllWorkoutNotes, {
					workoutId: input.workoutId as Id<"workouts">,
				});
				return notes.map(mapNote);
			} catch (error) {
				console.log(error);
			}
		}),
});
