import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { AddNotes } from "../../components/AddNotes";
import { PageHead } from "../../components/Head";
import { PageTitle } from "../../components/PageTitle";
import { trpc } from "../../utils/trpc";

type PageProps = {};
const SessionNotes = (props: PageProps) => {
	const [currentNote, setCurrentNote] = useState("");
	const router = useRouter();
	const {
		query: { slug },
	} = router;
	const {
		data: notes,
		isLoading,
		refetch,
	} = trpc.note.getAllWorkoutNotes.useQuery({
		workoutId: slug as string,
	});

	const postNote = trpc.note.postNote.useMutation({
		onSuccess: () => {
			refetch();
		},
	});

	const handlePostNote = () => {
		postNote.mutate({
			description: currentNote,
			workoutId: slug as string,
		});
		setCurrentNote("");
	};

	return (
		<>
			<PageHead title="All Workouts" />
			<PageTitle title="Workout notes" />
			<div className="relative min-h-[70vh]">
				{isLoading ? (
					<div>Fetching notes...</div>
				) : (
					<div>
						{notes && notes.length <= 0 ? (
							<h2>no notes yet</h2>
						) : (
							<>
								{notes?.map((session) => (
									<div
										key={session.id}
										className="mb-3 flex flex-col items-start"
									>
										<div className="max-w-[80%] rounded-lg rounded-tl-none bg-secondary px-4 py-2 text-secondary-foreground">
											{session.description}
										</div>
										<time className="mt-1 text-xs text-muted-foreground">
											{dayjs(session?.createdAt).format("DD.MM.YYYY")}
										</time>
									</div>
								))}
							</>
						)}
						<div className="absolute bottom-0 w-full">
							<AddNotes refetch={refetch} workoutId={slug as string} />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default SessionNotes;
