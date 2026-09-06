import { Cross2Icon } from "@radix-ui/react-icons";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

type Props = {
	children: React.ReactNode;
	open: boolean;
	// add disableClickOutside
	disableClickOutside?: boolean;
	//add onClose event so that we can close the modal from inside the component
	onClose(): void;
	className?: string;
};

export const Modal = ({
	children,
	open,
	disableClickOutside,
	onClose,
	className = "",
}: Props) => {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
				<DialogContent
					className={className}
					onInteractOutside={(event) => {
						if (disableClickOutside) {
							event.preventDefault();
						}
					}}
				>
					{children}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer
			shouldScaleBackground={false}
			open={open}
			onOpenChange={(isOpen) => !isOpen && onClose()}
		>
			<DrawerContent
				className={className}
				onInteractOutside={(event) => {
					if (disableClickOutside) {
						event.preventDefault();
					}
				}}
			>
				<div className="p-4">{children}</div>
			</DrawerContent>
		</Drawer>
	);
};

export function ReusableAlertDialog({
	triggerText,
	title = "Are you sure?",
	description = "This action is irreversible.",
	cancelText = "Cancel",
	actionText = "Confirm",
	onConfirm,
	onCancel,
	children,
	open,
}: {
	onConfirm: () => void;
	onCancel: () => void;
	triggerText?: string;
	title: string;
	description?: string;
	cancelText: string;
	actionText: string;
	children: React.ReactNode;
	open: boolean;
}) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<AlertDialog
				open={open}
				onOpenChange={(isOpen) => {
					// Route Escape / outside interactions through onCancel so Radix can
					// run its close lifecycle and clean up the body pointer-events lock.
					if (!isOpen) {
						onCancel();
					}
				}}
			>
				{triggerText ? (
					<AlertDialogTrigger asChild>
						<Button variant="outline">{triggerText}</Button>
					</AlertDialogTrigger>
				) : null}
				<AlertDialogContent>
					<button
						type="button"
						onClick={onCancel}
						className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					>
						<Cross2Icon className="h-4 w-4" />
						<span className="sr-only">{cancelText}</span>
					</button>
					<AlertDialogHeader>
						<AlertDialogTitle>{title}</AlertDialogTitle>
						<AlertDialogDescription>{description}</AlertDialogDescription>
						{children}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={onConfirm}>
							{actionText}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	return (
		<Drawer
			shouldScaleBackground={false}
			open={open}
			onOpenChange={(isOpen) => {
				// Route swipe-to-close / outside interactions through onCancel so the
				// close lifecycle runs and body pointer-events lock is cleaned up.
				if (!isOpen) {
					onCancel();
				}
			}}
		>
			{triggerText ? (
				<DrawerTrigger asChild>
					<Button variant="outline">{triggerText}</Button>
				</DrawerTrigger>
			) : null}
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					{description ? (
						<DrawerDescription>{description}</DrawerDescription>
					) : null}
				</DrawerHeader>
				<div className="px-4">{children}</div>
				<DrawerFooter>
					<Button onClick={onConfirm}>{actionText}</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
