import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import cn from "classnames";

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
    "modal-bottom": true,
    "sm:modal-middle": true,
    "modal-open": open,
    [className]: className,
  });

  return (
    <dialog className={modalClass}>
      <div className="modal-box">
        <div ref={ref}>{children}</div>
      </div>
    </dialog>
  );
};
