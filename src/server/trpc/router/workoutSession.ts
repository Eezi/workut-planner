import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { protectedProcedure, router } from "../trpc";
import { mapSession } from "./_map";

export const workoutSessionRouter = router({
	postWorkoutSession: protectedProcedure
		.input(
			z.object({
				workoutId: z.string(),
				date: z.date(),
				userId: z.string(),
				done: z.boolean(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.workoutSessions.postWorkoutSession, {
					workoutId: input.workoutId as Id<"workouts">,
					date: input.date.getTime(),
					userId: input.userId,
					done: input.done,
				});
			} catch (error) {
				console.log(error);
			}
		}),

	markSessionDone: protectedProcedure
		.input(z.object({ id: z.string(), done: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.workoutSessions.markSessionDone, {
					id: input.id as Id<"workoutSessions">,
					done: input.done,
				});
			} catch (error) {
				console.log(error);
			}
		}),

	editSessionNotes: protectedProcedure
		.input(z.object({ id: z.string(), notes: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.workoutSessions.editSessionNotes, {
					id: input.id as Id<"workoutSessions">,
					notes: input.notes,
				});
			} catch (error) {
				console.log(error);
			}
		}),

	removeSession: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.workoutSessions.removeSession, {
					id: input.id as Id<"workoutSessions">,
				});
			} catch (error) {
				console.warn("Error [removeSession]", error);
			}
		}),

	editSession: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				date: z.date(),
				notes: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.convex.mutation(api.workoutSessions.editSession, {
					id: input.id as Id<"workoutSessions">,
					date: input.date.getTime(),
					notes: input.notes,
				});
			} catch (error) {
				console.log(error);
			}
		}),

	getAllWorkoutSessions: protectedProcedure.query(async ({ ctx }) => {
		try {
			const sessions = await ctx.convex.query(
				api.workoutSessions.getAllWorkoutSessions,
				{ userId: ctx.session.user.id },
			);
			return sessions.map(mapSession);
		} catch (error) {
			console.log("[getAllWorkoutSessions]: Error", error);
		}
	}),

	getAllWorkoutNotes: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const sessions = await ctx.convex.query(
					api.workoutSessions.getAllWorkoutNotes,
					{
						userId: ctx.session.user.id,
						workoutId: input.id as Id<"workouts">,
					},
				);
				return sessions.map(mapSession);
			} catch (error) {
				console.log("error", error);
			}
		}),

	sessionById: protectedProcedure
		.input(z.object({ id: z.string().optional() }))
		.query(async ({ ctx, input }) => {
			try {
				const session = await ctx.convex.query(
					api.workoutSessions.sessionById,
					{ id: input.id ? (input.id as Id<"workoutSessions">) : undefined },
				);
				return mapSession(session);
			} catch (error) {
				console.log(error);
			}
		}),

	allDoneSessions: protectedProcedure
		.input(
			z
				.object({
					workoutId: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			try {
				const sessions = await ctx.convex.query(
					api.workoutSessions.allDoneSessions,
					{
						userId: ctx.session.user.id,
						workoutId: input?.workoutId
							? (input.workoutId as Id<"workouts">)
							: undefined,
					},
				);
				return sessions.map(mapSession);
			} catch (error) {
				console.log("[allDoneSessions]: Error", error);
			}
		}),

	fetchLatestDoneSession: protectedProcedure
		.input(z.object({ workoutId: z.string().optional() }))
		.query(async ({ ctx, input }) => {
			try {
				const session = await ctx.convex.query(
					api.workoutSessions.fetchLatestDoneSession,
					{
						userId: ctx.session.user.id,
						workoutId: input.workoutId
							? (input.workoutId as Id<"workouts">)
							: undefined,
					},
				);
				return mapSession(session);
			} catch (error) {
				console.log("[fetchLatestDoneSession]: Error", error);
			}
		}),
});
