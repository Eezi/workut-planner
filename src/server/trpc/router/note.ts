import { TRPCError } from "@trpc/server";
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

	updateNote: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				description: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const updated = await ctx.convex.mutation(api.notes.updateNote, {
					id: input.id as Id<"notes">,
					description: input.description,
				});
				return mapNote(updated);
			} catch (error) {
				console.log(error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update note",
				});
			}
		}),

	deleteNote: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.notes.deleteNote, {
					id: input.id as Id<"notes">,
				});
				return { success: true };
			} catch (error) {
				console.log(error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete note",
				});
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
