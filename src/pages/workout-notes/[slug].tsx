import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, StickyNote, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { AddNotes } from "../../components/AddNotes";
import { PageHead } from "../../components/Head";
import { trpc } from "../../utils/trpc";

dayjs.extend(relativeTime);

type Note = {
	id: string;
	description: string;
	createdAt: Date;
};

const LONG_PRESS_MS = 500;

const SessionNotes = () => {
	const router = useRouter();
	const {
		query: { slug },
	} = router;
	const utils = trpc.useContext();
	const queryInput = { workoutId: slug as string };
	const {
		data: notes,
		isLoading,
		refetch,
	} = trpc.note.getAllWorkoutNotes.useQuery(queryInput, {
		enabled: typeof slug === "string",
	});

	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState("");
	const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const updateNote = trpc.note.updateNote.useMutation({
		onMutate: async (input) => {
			setDrawerOpen(false);
			setIsEditing(false);
			await utils.note.getAllWorkoutNotes.cancel(queryInput);
			const previousNotes = utils.note.getAllWorkoutNotes.getData(queryInput);
			utils.note.getAllWorkoutNotes.setData(
				queryInput,
				(old: Note[] | undefined) =>
					old?.map((note) =>
						note.id === input.id
							? { ...note, description: input.description }
							: note,
					),
			);
			return { previousNotes };
		},
		onError: (_error, _input, context) => {
			utils.note.getAllWorkoutNotes.setData(queryInput, context?.previousNotes);
		},
		onSettled: () => {
			utils.note.getAllWorkoutNotes.invalidate(queryInput);
		},
	});
	const deleteNote = trpc.note.deleteNote.useMutation({
		onMutate: async (input) => {
			setDrawerOpen(false);
			await utils.note.getAllWorkoutNotes.cancel(queryInput);
			const previousNotes = utils.note.getAllWorkoutNotes.getData(queryInput);
			utils.note.getAllWorkoutNotes.setData(
				queryInput,
				(old: Note[] | undefined) =>
					old?.filter((note) => note.id !== input.id),
			);
			return { previousNotes };
		},
		onError: (_error, _input, context) => {
			utils.note.getAllWorkoutNotes.setData(queryInput, context?.previousNotes);
		},
		onSettled: () => {
			utils.note.getAllWorkoutNotes.invalidate(queryInput);
		},
	});

	const startLongPress = (note: Note) => {
		cancelLongPress();
		longPressTimer.current = setTimeout(() => {
			setSelectedNote(note);
			setIsEditing(false);
			setDrawerOpen(true);
		}, LONG_PRESS_MS);
	};

	const cancelLongPress = () => {
		if (longPressTimer.current) {
			clearTimeout(longPressTimer.current);
			longPressTimer.current = null;
		}
	};

	const handleDrawerOpenChange = (open: boolean) => {
		setDrawerOpen(open);
		if (!open) {
			setIsEditing(false);
			setSelectedNote(null);
		}
	};

	return (
		<>
			<PageHead title="Workout notes" />
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-44">
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
				) : notes && notes.length > 0 ? (
					<div className="flex flex-col gap-3">
						<AnimatePresence initial={true} mode="popLayout">
							{notes.map((note: Note, index: number) => (
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
									className="select-none rounded-2xl border border-white/5 bg-white/5 px-4 py-3 active:bg-white/10"
									style={{ WebkitTouchCallout: "none" }}
									onPointerDown={() => startLongPress(note)}
									onPointerUp={cancelLongPress}
									onPointerCancel={cancelLongPress}
									onPointerLeave={cancelLongPress}
									onContextMenu={(event) => event.preventDefault()}
								>
									<p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-white/80">
										{note.description}
									</p>
									<div>
										<span className="text-xs text-white/40">
											{dayjs(note.createdAt).fromNow()}
										</span>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
						<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
							<StickyNote className="h-5 w-5 text-white/30" />
						</div>
						<p className="text-sm font-medium text-white/70">No notes yet</p>
						<p className="mt-1 text-xs text-white/40">
							Add your first note below.
						</p>
					</div>
				)}
			</div>

			<div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-4 pt-3 backdrop-blur [padding-bottom:calc(env(safe-area-inset-bottom)+0.75rem)]">
				<div className="mx-auto w-full max-w-2xl">
					<AddNotes refetch={refetch} workoutId={slug as string} />
				</div>
			</div>

			<Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
				<DrawerContent>
					{isEditing ? (
						<>
							<DrawerHeader>
								<DrawerTitle>Edit note</DrawerTitle>
							</DrawerHeader>
							<div className="px-4">
								<Textarea
									autoFocus
									className="min-h-[100px]"
									value={editText}
									onChange={({ currentTarget }) =>
										setEditText(currentTarget.value)
									}
								/>
							</div>
							<DrawerFooter>
								<Button
									onClick={() => {
										if (!selectedNote || !editText.trim()) return;
										updateNote.mutate({
											id: selectedNote.id,
											description: editText,
										});
									}}
									disabled={!editText.trim() || updateNote.isLoading}
								>
									{updateNote.isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Save
								</Button>
								<Button variant="outline" onClick={() => setIsEditing(false)}>
									Cancel
								</Button>
							</DrawerFooter>
						</>
					) : (
						<>
							<DrawerHeader>
								<DrawerTitle>Note</DrawerTitle>
								<DrawerDescription className="line-clamp-3 whitespace-pre-line">
									{selectedNote?.description}
								</DrawerDescription>
							</DrawerHeader>
							<DrawerFooter>
								<Button
									variant="outline"
									onClick={() => {
										setEditText(selectedNote?.description ?? "");
										setIsEditing(true);
									}}
								>
									<Pencil className="mr-2 h-4 w-4" />
									Edit note
								</Button>
								<Button
									variant="destructive"
									onClick={() => {
										if (!selectedNote) return;
										deleteNote.mutate({ id: selectedNote.id });
									}}
									disabled={deleteNote.isLoading}
								>
									{deleteNote.isLoading ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="mr-2 h-4 w-4" />
									)}
									Delete note
								</Button>
							</DrawerFooter>
						</>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SessionNotes;
