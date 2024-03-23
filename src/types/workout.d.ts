export interface Workout {
    intensity: string;
    title: string;
    id: string;
    userId: string;
    description?: string | null;
    reps?: number;
}
