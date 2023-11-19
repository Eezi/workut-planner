import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import dayjs from "dayjs";
import { DateType } from "react-tailwindcss-datepicker/dist/types";

interface CountFilter {
  workoutId: string;
  userId: string;
  doneAt?: { gte?: Date; lte?: Date };
}

export const workoutRouter = router({
  postWorkout: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        userId: z.string(),
        intensity: z.enum(["HARD", "MEDIUM", "EASY"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workout.create({
          data: {
            title: input.title,
            description: input.description,
            intensity: input.intensity,
            userId: input.userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  // Later we can change this to publicProcedure to see other user's workouts
  getAllWorkouts: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.workout.findMany({
        where: { userId: ctx.session.user.id },
        select: {
          title: true,
          description: true,
          intensity: true,
          userId: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),

  removeWorkout: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workout.delete({
          where: {
            id: input.id,
          },
        });

        await ctx.prisma.workoutSession.deleteMany({
          where: {
            workoutId: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  workoutById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.workout.findFirst({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  editWorkout: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        intensity: z.enum(["HARD", "MEDIUM", "EASY"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.workout.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            description: input.description,
            intensity: input.intensity,
          },
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
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const userWorkouts = await ctx.prisma.workout.findMany({
          where: {
            userId: ctx.session.user.id,
          },
          select: {
            id: true,
            title: true,
          },
        });

        const workoutWithSessionCounts = await Promise.all(
          userWorkouts.map(async (workout: any) => {
            const filter: CountFilter = {
              workoutId: workout.id,
              userId: ctx.session.user.id,
            };

            if (input?.startDate || input?.endDate) {
              filter.doneAt = {};

              if (input?.startDate) {
                filter.doneAt.gte = new Date(
                  dayjs(input?.startDate).startOf("day").toString()
                );
              }

              if (input?.endDate) {
                filter.doneAt.lte = new Date(
                  dayjs(input?.endDate).endOf("day").toString()
                );
              }
            }

            const sessionCount = await ctx.prisma.workoutSession.count({
              where: filter,
            });

            const latestSession = await ctx.prisma.workoutSession.findFirst({
              where: {
                userId: ctx.session.user.id,
                workoutId: workout.id,
                done: true,
              },
              orderBy: {
                date: "desc",
              },
            });

            return {
              ...workout,
              count: sessionCount,
              latestSession,
            };
          })
        );

        /*const groupedData = await prisma.workoutSession.groupBy({
  by: ['workoutId'],
  where: {
    userId: ctx.session.user.id,
    createdAt: {
      gte: new Date('start_date'),
      lte: new Date('end_date')
    }
  },
  _count: {
    _all: true,
  },
});*/

        return workoutWithSessionCounts;
      } catch (error) {
        console.log("error", error);
      }
    }),
});
