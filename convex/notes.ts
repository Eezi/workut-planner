import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const postNote = mutation({
	args: {
		description: v.string(),
		workoutId: v.id("workouts"),
		workoutSessionId: v.optional(v.id("workoutSessions")),
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("notes", {
			workoutId: args.workoutId,
			workoutSessionId: args.workoutSessionId ?? null,
			userId: args.userId,
			description: args.description,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(id);
	},
});

export const getAllWorkoutNotes = query({
	args: { workoutId: v.id("workouts") },
	handler: async (ctx, { workoutId }) => {
		return await ctx.db
			.query("notes")
			.withIndex("by_workout", (q) => q.eq("workoutId", workoutId))
			.collect();
	},
});
