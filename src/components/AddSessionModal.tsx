import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import cn from "classnames";
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
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    if (!disableClickOutside) {
      onClose();
    }
  });

  const modalClass = cn({
    modal: true,
    //  "modal-bottom": true,
    // "sm:modal-middle": true,
    "modal-open": open,
    [className]: className,
  });

  return (
    <dialog className={modalClass}>
      <div className="modal-box px-2">
        <div ref={ref}>{children}</div>
      </div>
    </dialog>
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
