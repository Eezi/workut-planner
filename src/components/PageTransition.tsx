import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type PageTransitionProps = HTMLMotionProps<"div">;
type PageTransitionRef = React.ForwardedRef<HTMLDivElement>;

export const PageTransition = forwardRef(
  (props: PageTransitionProps, ref: PageTransitionRef) => {
    const { children, ...rest } = props;
    const onTheRight = { x: "100%" };
    const inTheCenter = { x: 0 };
    const onTheLeft = { x: "-100%" };

    const transition = { duration: 0.1, ease: "easeInOut" };

    return (
      <motion.div
        ref={ref}
        initial={onTheRight}
        animate={inTheCenter}
        exit={onTheLeft}
        transition={transition}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);
