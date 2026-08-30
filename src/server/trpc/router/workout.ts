import dayjs from "dayjs";
import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { protectedProcedure, router } from "../trpc";
import { mapSession, mapWorkout } from "./_map";

export const workoutRouter = router({
	postWorkout: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string(),
				userId: z.string(),
				reps: z.number(),
				intensity: z.string(),
				includeSeconds: z.boolean().optional(),
				includeWeight: z.boolean().optional(),
				includeReps: z.boolean().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.workouts.postWorkout, {
					title: input.title,
					description: input.description,
					userId: input.userId,
					reps: input.reps,
					intensity: input.intensity,
					includeSeconds: input.includeSeconds,
					includeWeight: input.includeWeight,
					includeReps: input.includeReps,
				});
			} catch (error) {
				console.log(error);
			}
		}),

	getAllWorkouts: protectedProcedure.query(async ({ ctx }) => {
		try {
			console.log("ctx.session.user.id", ctx.session.user.id);
			const workouts = await ctx.convex.query(api.workouts.getAllWorkouts, {
				userId: ctx.session.user.id,
			});
			return workouts.map(mapWorkout);
		} catch (error) {
			console.log("error", error);
		}
	}),

	removeWorkout: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.workouts.removeWorkout, {
					id: input.id as Id<"workouts">,
				});
			} catch (error) {
				console.warn("Error [removeWorkout]", error);
			}
		}),

	workoutById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const workout = await ctx.convex.query(api.workouts.workoutById, {
					id: input.id as Id<"workouts">,
				});
				return mapWorkout(workout);
			} catch (error) {
				console.log(error);
			}
		}),

	editWorkout: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string(),
				reps: z.number(),
				description: z.string(),
				intensity: z.string(),
				includeSeconds: z.boolean().optional(),
				includeWeight: z.boolean().optional(),
				includeReps: z.boolean().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.workouts.editWorkout, {
					id: input.id as Id<"workouts">,
					title: input.title,
					reps: input.reps,
					description: input.description,
					intensity: input.intensity,
					includeSeconds: input.includeSeconds,
					includeWeight: input.includeWeight,
					includeReps: input.includeReps,
				});
			} catch (error) {
				console.log(error);
			}
		}),

	sessionCountsPerWorkout: protectedProcedure
		.input(
			z.object({
				startDate: z.union([z.string(), z.instanceof(Date), z.null()]),
				endDate: z.union([z.string(), z.instanceof(Date), z.null()]),
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const startDate = input.startDate
					? dayjs(input.startDate).startOf("day").valueOf()
					: null;
				const endDate = input.endDate
					? dayjs(input.endDate).endOf("day").valueOf()
					: null;

				const result = await ctx.convex.query(
					api.workouts.sessionCountsPerWorkout,
					{ userId: ctx.session.user.id, startDate, endDate },
				);

				return result.map((r) => ({
					id: r.id,
					title: r.title,
					count: r.count,
					latestSession: mapSession(r.latestSession),
				}));
			} catch (error) {
				console.log("error", error);
			}
		}),
});
