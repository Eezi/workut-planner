import type { Dayjs } from "dayjs";
import { Check, Plus } from "lucide-react";
import Link from "next/link";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Session } from "../types/Session";
import { sliceLongText } from "../utils/sliceLongText";
import { Button } from "./ui/button";
import { intensityColors } from "./workoutCard";

const SessionRow = ({ session }: { session: Session }) => {
	const accent =
		intensityColors.get(session.workout?.intensity ?? "") ?? "#6b7280";

	return (
		<Link
			href={{
				pathname: "/session-view/[slug]",
				query: { slug: session.id },
			}}
			className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/5"
		>
			<span
				className="h-2.5 w-2.5 shrink-0 rounded-full"
				style={{ backgroundColor: accent, opacity: session.done ? 0.4 : 1 }}
			/>
			<span
				className={`grow text-sm ${
					session.done ? "text-slate-500 line-through" : "text-white"
				}`}
			>
				{sliceLongText(session.workout?.title)}
			</span>
			{session.done && <Check className="h-4 w-4 shrink-0 text-slate-500" />}
		</Link>
	);
};

const SessionList = ({ sessions }: { sessions: Session[] }) => (
	<div className="flex flex-col">
		{sessions.map((session) => (
			<SessionRow key={session.id} session={session} />
		))}
	</div>
);

const AddSessionRow = ({ onAddSession }: { onAddSession: () => void }) => (
	<Button
		variant="ghost"
		onClick={onAddSession}
		className="w-full justify-start gap-3 px-2 text-sm text-slate-400 hover:text-white"
	>
		<Plus className="h-4 w-4" />
		Add session
	</Button>
);

type Props = {
	day: Dayjs;
	sessions: Session[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddSession: () => void;
	canAddSessions: boolean;
	children: React.ReactNode;
};

export const DaySessionsPopover = ({
	day,
	sessions,
	open,
	onOpenChange,
	onAddSession,
	canAddSessions,
	children,
}: Props) => {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const title = day.format("dddd DD.MM.");

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>{children}</PopoverTrigger>
				<PopoverContent align="center" className="w-64 p-2">
					<p className="px-2 pb-1 pt-1 text-xs font-medium text-slate-400">
						{title}
					</p>
					<SessionList sessions={sessions} />
					{canAddSessions && (
						<div className="mt-1 border-t border-white/10 pt-1">
							<AddSessionRow onAddSession={onAddSession} />
						</div>
					)}
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer
			shouldScaleBackground={false}
			open={open}
			onOpenChange={onOpenChange}
		>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
				</DrawerHeader>
				<div className="px-4">
					<SessionList sessions={sessions} />
				</div>
				<DrawerFooter>
					{canAddSessions && <AddSessionRow onAddSession={onAddSession} />}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
