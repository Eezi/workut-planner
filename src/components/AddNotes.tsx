import { Plus, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { trpc } from "../utils/trpc";
import { Button } from "./ui/button";

export const AddNotes = ({
	workoutId,
	workoutSessionId,
	refetch,
	className,
}: {
	workoutId: string;
	workoutSessionId?: string;
	refetch?: () => void;
	className?: string;
}) => {
	const [currentNote, setCurrentNote] = useState("");

	const postNote = trpc.note.postNote.useMutation({
		onSuccess: () => {
			if (typeof refetch === "function") {
				refetch();
			}
		},
	});

	const handlePostNote = () => {
		if (!currentNote.trim()) return;
		postNote.mutate({
			description: currentNote,
			workoutId,
			workoutSessionId,
		});
		setCurrentNote("");
	};

	return (
		<div className={cn("flex items-end gap-2", className)}>
			<div className="flex min-h-[44px] flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
				<Plus className="h-4 w-4 shrink-0 text-white/40" />
				<textarea
					rows={1}
					className="max-h-32 w-full resize-none bg-transparent text-sm leading-relaxed text-white placeholder:text-white/40 focus:outline-none"
					placeholder="Add a note"
					value={currentNote}
					onChange={({ currentTarget }) => setCurrentNote(currentTarget.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							handlePostNote();
						}
					}}
				/>
			</div>
			<Button
				size="icon"
				className="h-11 w-11 shrink-0 rounded-full"
				onClick={handlePostNote}
				disabled={!currentNote.trim() || postNote.isLoading}
				aria-label="Add note"
			>
				<SendHorizontal className="h-4 w-4" />
			</Button>
		</div>
	);
};
