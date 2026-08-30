export type Workout = {
	id: string;
	createdAt: Date;
	userId: string;
	title: string;
	description: string | null;
	includeSeconds: boolean | null;
	includeWeight: boolean | null;
	includeReps: boolean | null;
	reps: number | null;
	intensity: string;
};

export type WorkoutSession = {
	id: string;
	createdAt: Date;
	userId: string;
	workoutId: string;
	date: Date;
	done: boolean;
	doneAt: Date | null;
	notes: string | null;
	noteId: string | null;
};

export type Rep = {
	id: string;
	done: boolean;
	secoundsAmount: number | null;
	weightAmount: number | null;
	repsAmount: number | null;
	workoutSessionId: string | null;
	workoutId: string;
};

export type Note = {
	id: string;
	createdAt: Date;
	description: string;
	updatedAt: Date | null;
	workoutId: string;
	userId: string;
	workoutSessionId: string | null;
};
