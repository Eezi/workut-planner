import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, StickyNote } from "lucide-react";
import { useRouter } from "next/router";
import { AddNotes } from "../../components/AddNotes";
import { PageHead } from "../../components/Head";
import { trpc } from "../../utils/trpc";

type PageProps = {};
const SessionNotes = (props: PageProps) => {
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

	return (
		<>
			<PageHead title="Workout notes" />
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-24">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
						<StickyNote className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
							Workout notes
						</h1>
						<p className="text-xs text-white/40 sm:text-sm">
							Keep track of thoughts and progress
						</p>
					</div>
				</div>

				{isLoading ? (
					<div className="flex justify-center py-16">
						<Loader2 className="h-5 w-5 animate-spin text-primary" />
					</div>
				) : (
					<div className="flex flex-col gap-6">
						{notes && notes.length > 0 ? (
							<div className="flex flex-col gap-4">
								<AnimatePresence initial={true} mode="popLayout">
									{notes.map((note, index) => (
										<motion.div
											key={note.id}
											layout
											initial={{ opacity: 0, y: 12, scale: 0.96 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -8, scale: 0.96 }}
											transition={{
												duration: 0.25,
												ease: "easeOut",
												delay: Math.min(index * 0.04, 0.3),
											}}
											className="flex flex-col items-start gap-1"
										>
											<div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-2.5 text-sm leading-relaxed text-white/80">
												{note.description}
											</div>
											<time className="pl-1 text-[11px] text-white/30">
												{dayjs(note?.createdAt).format("DD.MM.YYYY")}
											</time>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
								<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
									<StickyNote className="h-5 w-5 text-white/30" />
								</div>
								<p className="text-sm font-medium text-white/70">
									No notes yet
								</p>
								<p className="mt-1 text-xs text-white/40">
									Add your first note below.
								</p>
							</div>
						)}

						<div className="flex flex-col gap-2">
							<span className="text-xs font-medium uppercase tracking-wide text-white/40">
								Add a note
							</span>
							<AddNotes refetch={refetch} workoutId={slug as string} />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default SessionNotes;
