import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllWorkouts = query({
	args: { userId: v.string() },
	handler: async (ctx, { userId }) => {
		return await ctx.db
			.query("workouts")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.order("desc")
			.collect();
	},
});

export const postWorkout = mutation({
	args: {
		title: v.string(),
		description: v.string(),
		userId: v.string(),
		reps: v.number(),
		intensity: v.string(),
		includeSeconds: v.optional(v.boolean()),
		includeWeight: v.optional(v.boolean()),
		includeReps: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("workouts", {
			title: args.title,
			description: args.description,
			reps: args.reps,
			includeSeconds: args.includeSeconds,
			includeWeight: args.includeWeight,
			includeReps: args.includeReps,
			intensity: args.intensity,
			userId: args.userId,
		});
	},
});

export const removeWorkout = mutation({
	args: { id: v.id("workouts") },
	handler: async (ctx, { id }) => {
		const sessions = await ctx.db
			.query("workoutSessions")
			.withIndex("by_workout", (q) => q.eq("workoutId", id))
			.collect();
		for (const session of sessions) {
			const reps = await ctx.db
				.query("reps")
				.withIndex("by_session", (q) => q.eq("workoutSessionId", session._id))
				.collect();
			for (const rep of reps) await ctx.db.delete(rep._id);
			await ctx.db.delete(session._id);
		}
		const notes = await ctx.db
			.query("notes")
			.withIndex("by_workout", (q) => q.eq("workoutId", id))
			.collect();
		for (const note of notes) await ctx.db.delete(note._id);
		await ctx.db.delete(id);
	},
});

export const workoutById = query({
	args: { id: v.id("workouts") },
	handler: async (ctx, { id }) => await ctx.db.get(id),
});

export const editWorkout = mutation({
	args: {
		id: v.id("workouts"),
		title: v.string(),
		reps: v.number(),
		description: v.string(),
		intensity: v.string(),
		includeSeconds: v.optional(v.boolean()),
		includeWeight: v.optional(v.boolean()),
		includeReps: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			title: args.title,
			description: args.description,
			intensity: args.intensity,
			reps: args.reps,
			includeSeconds: args.includeSeconds,
			includeWeight: args.includeWeight,
			includeReps: args.includeReps,
		});
	},
});

export const sessionCountsPerWorkout = query({
	args: {
		userId: v.string(),
		startDate: v.union(v.number(), v.null()),
		endDate: v.union(v.number(), v.null()),
	},
	handler: async (ctx, { userId, startDate, endDate }) => {
		const workouts = await ctx.db
			.query("workouts")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();

		return await Promise.all(
			workouts.map(async (workout) => {
				const sessions = await ctx.db
					.query("workoutSessions")
					.withIndex("by_user_workout", (q) =>
						q.eq("userId", userId).eq("workoutId", workout._id),
					)
					.collect();

				const inRange = sessions.filter((s) => {
					if (startDate === null && endDate === null) return true;
					if (s.doneAt === null || s.doneAt === undefined) return false;
					if (startDate !== null && s.doneAt < startDate) return false;
					if (endDate !== null && s.doneAt > endDate) return false;
					return true;
				});

				const latestDone = sessions
					.filter((s) => s.done)
					.sort((a, b) => b.date - a.date)[0];

				return {
					id: workout._id,
					title: workout.title,
					count: inRange.length,
					latestSession: latestDone ?? null,
				};
			}),
		);
	},
});
