import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
	return (
		<AlertDialog open={open}>
			<AlertDialogTrigger asChild>
				{triggerText && <Button variant="outline">{triggerText}</Button>}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
					{children}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						{actionText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
