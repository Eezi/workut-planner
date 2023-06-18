export type Intensity = "HARD" | "MEDIUM" | "EASY"

export interface Workout {
    intensity: Intensity;
    title: string;
    id: string;
    userId: string;
    description?: string;
}
