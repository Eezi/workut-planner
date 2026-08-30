export const mapWorkout = (w: any): any => {
	if (!w) return null;
	return {
		id: w._id,
		createdAt: new Date(w._creationTime),
		userId: w.userId,
		title: w.title,
		description: w.description ?? null,
		includeSeconds: w.includeSeconds ?? null,
		includeWeight: w.includeWeight ?? null,
		includeReps: w.includeReps ?? null,
		reps: w.reps ?? null,
		intensity: w.intensity,
	};
};

export const mapRep = (r: any): any => {
	if (!r) return null;
	return {
		id: r._id,
		done: r.done,
		secoundsAmount: r.secoundsAmount ?? null,
		weightAmount: r.weightAmount ?? null,
		repsAmount: r.repsAmount ?? null,
		workoutSessionId: r.workoutSessionId ?? null,
		workoutId: r.workoutId,
	};
};

export const mapSession = (s: any): any => {
	if (!s) return null;
	const mapped: any = {
		id: s._id,
		createdAt: new Date(s._creationTime),
		userId: s.userId,
		workoutId: s.workoutId,
		date: new Date(s.date),
		done: s.done,
		doneAt:
			s.doneAt !== null && s.doneAt !== undefined ? new Date(s.doneAt) : null,
		notes: s.notes ?? null,
		noteId: s.noteId ?? null,
	};
	if ("workout" in s) mapped.workout = mapWorkout(s.workout);
	if ("reps" in s) mapped.reps = (s.reps ?? []).map(mapRep);
	return mapped;
};

export const mapNote = (n: any): any => {
	if (!n) return null;
	return {
		id: n._id,
		createdAt: new Date(n._creationTime),
		description: n.description,
		updatedAt:
			n.updatedAt !== null && n.updatedAt !== undefined
				? new Date(n.updatedAt)
				: null,
		workoutId: n.workoutId,
		userId: n.userId,
		workoutSessionId: n.workoutSessionId ?? null,
	};
};
