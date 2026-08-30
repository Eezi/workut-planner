import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	workouts: defineTable({
		userId: v.string(),
		title: v.string(),
		description: v.optional(v.union(v.string(), v.null())),
		includeSeconds: v.optional(v.union(v.boolean(), v.null())),
		includeWeight: v.optional(v.union(v.boolean(), v.null())),
		includeReps: v.optional(v.union(v.boolean(), v.null())),
		reps: v.optional(v.union(v.number(), v.null())),
		intensity: v.string(),
	}).index("by_user", ["userId"]),

	workoutSessions: defineTable({
		userId: v.string(),
		workoutId: v.id("workouts"),
		date: v.number(),
		done: v.boolean(),
		doneAt: v.optional(v.union(v.number(), v.null())),
		notes: v.optional(v.union(v.string(), v.null())),
		noteId: v.optional(v.union(v.id("notes"), v.null())),
	})
		.index("by_user", ["userId"])
		.index("by_workout", ["workoutId"])
		.index("by_user_workout", ["userId", "workoutId"]),

	reps: defineTable({
		done: v.boolean(),
		secoundsAmount: v.optional(v.union(v.number(), v.null())),
		weightAmount: v.optional(v.union(v.number(), v.null())),
		repsAmount: v.optional(v.union(v.number(), v.null())),
		workoutId: v.id("workouts"),
		workoutSessionId: v.optional(v.union(v.id("workoutSessions"), v.null())),
	}).index("by_session", ["workoutSessionId"]),

	notes: defineTable({
		description: v.string(),
		updatedAt: v.optional(v.union(v.number(), v.null())),
		workoutId: v.id("workouts"),
		userId: v.string(),
		workoutSessionId: v.optional(v.union(v.id("workoutSessions"), v.null())),
	}).index("by_workout", ["workoutId"]),
});
