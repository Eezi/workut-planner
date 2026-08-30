import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, type QueryCtx, query } from "./_generated/server";

const hydrateSession = async (
	ctx: QueryCtx,
	session: Doc<"workoutSessions">,
) => {
	const workout = await ctx.db.get(session.workoutId);
	const reps = await ctx.db
		.query("reps")
		.withIndex("by_session", (q) => q.eq("workoutSessionId", session._id))
		.collect();
	return { ...session, workout, reps };
};

export const postWorkoutSession = mutation({
	args: {
		workoutId: v.id("workouts"),
		date: v.number(),
		userId: v.string(),
		done: v.boolean(),
	},
	handler: async (ctx, args) => {
		const workout = await ctx.db.get(args.workoutId);
		const sessionId = await ctx.db.insert("workoutSessions", {
			workoutId: args.workoutId,
			date: args.date,
			userId: args.userId,
			done: args.done,
		});
		const count = workout?.reps ?? 0;
		for (let i = 0; i < count; i++) {
			await ctx.db.insert("reps", {
				workoutId: args.workoutId,
				workoutSessionId: sessionId,
				done: false,
			});
		}
	},
});

export const markSessionDone = mutation({
	args: { id: v.id("workoutSessions"), done: v.boolean() },
	handler: async (ctx, { id, done }) => {
		await ctx.db.patch(id, { done, doneAt: done ? Date.now() : null });
	},
});

export const editSessionNotes = mutation({
	args: { id: v.id("workoutSessions"), notes: v.string() },
	handler: async (ctx, { id, notes }) => {
		await ctx.db.patch(id, { notes });
	},
});

export const removeSession = mutation({
	args: { id: v.id("workoutSessions") },
	handler: async (ctx, { id }) => {
		const reps = await ctx.db
			.query("reps")
			.withIndex("by_session", (q) => q.eq("workoutSessionId", id))
			.collect();
		for (const rep of reps) await ctx.db.delete(rep._id);
		await ctx.db.delete(id);
	},
});

export const editSession = mutation({
	args: {
		id: v.id("workoutSessions"),
		date: v.number(),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, { id, date, notes }) => {
		const patch: { date: number; notes?: string } = { date };
		if (notes !== undefined) patch.notes = notes;
		await ctx.db.patch(id, patch);
	},
});

export const getAllWorkoutSessions = query({
	args: { userId: v.string() },
	handler: async (ctx, { userId }) => {
		const sessions = await ctx.db
			.query("workoutSessions")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();
		const notDone = sessions.filter((s) => !s.done);
		return await Promise.all(notDone.map((s) => hydrateSession(ctx, s)));
	},
});

export const getAllWorkoutNotes = query({
	args: { userId: v.string(), workoutId: v.id("workouts") },
	handler: async (ctx, { userId, workoutId }) => {
		const sessions = await ctx.db
			.query("workoutSessions")
			.withIndex("by_user_workout", (q) =>
				q.eq("userId", userId).eq("workoutId", workoutId),
			)
			.collect();
		const withNotes = sessions.filter(
			(s) => s.notes !== null && s.notes !== undefined && s.notes !== "",
		);
		return await Promise.all(withNotes.map((s) => hydrateSession(ctx, s)));
	},
});

export const sessionById = query({
	args: { id: v.optional(v.id("workoutSessions")) },
	handler: async (ctx, { id }) => {
		if (!id) return null;
		const session = await ctx.db.get(id);
		if (!session) return null;
		return await hydrateSession(ctx, session);
	},
});

export const allDoneSessions = query({
	args: {
		userId: v.string(),
		workoutId: v.optional(v.id("workouts")),
	},
	handler: async (ctx, { userId, workoutId }) => {
		const sessions = workoutId
			? await ctx.db
					.query("workoutSessions")
					.withIndex("by_user_workout", (q) =>
						q.eq("userId", userId).eq("workoutId", workoutId),
					)
					.collect()
			: await ctx.db
					.query("workoutSessions")
					.withIndex("by_user", (q) => q.eq("userId", userId))
					.collect();
		const done = sessions
			.filter((s) => s.done)
			.sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0));
		return await Promise.all(done.map((s) => hydrateSession(ctx, s)));
	},
});

export const fetchLatestDoneSession = query({
	args: {
		userId: v.string(),
		workoutId: v.optional(v.id("workouts")),
	},
	handler: async (ctx, { userId, workoutId }) => {
		const sessions = workoutId
			? await ctx.db
					.query("workoutSessions")
					.withIndex("by_user_workout", (q) =>
						q.eq("userId", userId).eq("workoutId", workoutId),
					)
					.collect()
			: await ctx.db
					.query("workoutSessions")
					.withIndex("by_user", (q) => q.eq("userId", userId))
					.collect();
		const latest = sessions
			.filter((s) => s.done)
			.sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0))[0];
		if (!latest) return null;
		return await hydrateSession(ctx, latest);
	},
});
