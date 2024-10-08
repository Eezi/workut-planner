import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { Workout } from "@prisma/client";

const generateReps = (workout: Workout | null, sessionId: string) => {
  if (!workout) return [];
  const { reps, id } = workout;

  const repsList = reps
    ? [...Array(workout?.reps).keys()].map((n) => ({
        workoutId: id,
        workoutSessionId: sessionId,
        done: false,
      }))
    : [];

  console.log("repsList", repsList);
  return repsList;
};

export const workoutSessionRouter = router({
  postWorkoutSession: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        date: z.date(),
        userId: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const workout = await ctx.prisma.workout.findFirst({
          where: { id: input.workoutId },
        });

        const created = await ctx.prisma.workoutSession.create({
          data: {
            workoutId: input.workoutId,
            date: input.date,
            userId: input.userId,
            done: input.done,
            createdAt: new Date(),
          },
        });
        const reps = generateReps(workout, created.id);
        await Promise.all(
          reps?.map(async (rep) => {
            await ctx.prisma.rep.create({
              data: rep,
            });
          })
        );
      } catch (error) {
        console.log(error);
      }
    }),

  markSessionDone: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const doneAt = input.done === true ? new Date() : null;
      try {
        await ctx.prisma.workoutSession.update({
          where: {
            id: input.id,
          },
          data: {
            done: input.done,
            doneAt,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  editSessionNotes: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workoutSession.update({
          where: {
            id: input.id,
          },
          data: {
            notes: input.notes,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  removeSession: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workoutSession.delete({
          where: {
            id: input.id,
          },
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workoutSession.update({
          where: {
            id: input.id,
          },
          data: {
            date: input.date,
            notes: input.notes,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  // Later we can change this to publicProcedure to see other user's workouts
  getAllWorkoutSessions: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.workoutSession.findMany({
        where: { userId: ctx.session.user.id, done: false },
        include: {
          workout: true,
        },
        orderBy: {
          done: "asc",
        },
      });
    } catch (error) {
      console.log("[getAllWorkoutSessions]: Error", error);
    }
  }),

  getAllWorkoutNotes: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.workoutSession.findMany({
          where: {
            userId: ctx.session.user.id,
            workoutId: input.id,
            OR: [{ notes: { not: null } }, { notes: { not: "" } }],
          },
          include: {
            workout: true,
          },
          orderBy: {
            done: "asc",
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  sessionById: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.workoutSession.findFirst({
          where: {
            id: input.id,
          },
          include: {
            workout: true,
            reps: true,
          },
        });
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
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const sessions = await ctx.prisma.workoutSession.findMany({
          where: {
            userId: ctx.session.user.id,
            done: true,
            workoutId: input?.workoutId,
          },
          include: {
            workout: true,
            reps: true,
          },
          orderBy: {
            doneAt: "desc",
          },
        });
        return sessions;
      } catch (error) {
        console.log("[allDoneSessions]: Error", error);
      }
    }),

  fetchLatestDoneSession: protectedProcedure
    .input(
      z.object({
        workoutId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.workoutSession.findFirst({
          where: {
            userId: ctx.session.user.id,
            done: true,
            workoutId: input.workoutId,
          },
          include: {
            workout: true,
            reps: true,
          },
          orderBy: {
            doneAt: "desc",
          },
        });
      } catch (error) {
        console.log("[fetchLatestDoneSession]: Error", error);
      }
    }),
});
