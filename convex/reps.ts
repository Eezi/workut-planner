import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const editRep = mutation({
	args: {
		id: v.id("reps"),
		done: v.boolean(),
		secoundsAmount: v.optional(v.number()),
		repsAmount: v.optional(v.number()),
		weightAmount: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			done: args.done,
			...(args.secoundsAmount !== undefined
				? { secoundsAmount: args.secoundsAmount }
				: {}),
			...(args.repsAmount !== undefined ? { repsAmount: args.repsAmount } : {}),
			...(args.weightAmount !== undefined
				? { weightAmount: args.weightAmount }
				: {}),
		});
	},
});

export const createRep = mutation({
	args: {
		workoutId: v.id("workouts"),
		workoutSessionId: v.id("workoutSessions"),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("reps", {
			workoutId: args.workoutId,
			workoutSessionId: args.workoutSessionId,
			done: false,
		});
	},
});

export const removeRep = mutation({
	args: { id: v.id("reps") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});
