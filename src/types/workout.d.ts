export type Intensity = "HARD" | "MEDIUM" | "EASY"
export type RepUnit = "SECOND" | "KG"

export interface Workout {
    intensity: Intensity;
    title: string;
    id: string;
    userId: string;
    description?: string | null;
    reps?: number;
}
