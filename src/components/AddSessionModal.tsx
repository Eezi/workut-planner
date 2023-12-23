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
};

export const Modal = ({
  children,
  open,
  disableClickOutside,
  onClose,
}: Props) => {
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    if (!disableClickOutside) {
      onClose();
    }
  });

  const modalClass = cn({
    "modal modal-middle": true,
    "modal-open": open,
  });

  return (
    <div className={modalClass}>
      <div className="inline-block transform overflow-hidden rounded-lg bg-gray-900 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:align-middle md:h-4/6">
        <div className="relative mr-auto ml-auto w-full max-w-7xl items-center md:px-12 lg:px-24">
          <label
            htmlFor="my-modal-6"
            className="btn-sm btn-circle btn absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </label>
          <div className="grid grid-cols-1">
            <div className="mt-4 mr-auto mb-4 ml-auto max-w-lg bg-gray-900">
              <div className="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                <div ref={ref}>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
