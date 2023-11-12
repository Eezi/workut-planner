import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const SessionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData && status !== "loading") {
      router.push("/");
    }
  }, [status, sessionData]);

  return <>{children}</>;
};
