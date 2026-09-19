import { AnimatePresence, motion } from "framer-motion";
import type { AppType } from "next/app";
import { useRouter } from "next/router";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { BottomNavBar, Navbar } from "../components/Navbar";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { PageContainer } from "../components/PageContainer";
import { SessionContainer } from "../components/SessionContainer";

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	const router = useRouter();
	const pageKey = router.asPath;
	return (
		<SessionProvider session={session}>
			<SessionContainer>
				<PageContainer>
					<Navbar />
					<AnimatePresence initial={false} mode="popLayout">
						{/* popLayout attaches a ref to its direct child, so wrap the page
                (a plain function component) in a ref-capable motion.div */}
						<motion.div key={pageKey}>
							<Component {...pageProps} />
						</motion.div>
					</AnimatePresence>
					<BottomNavBar />
				</PageContainer>
			</SessionContainer>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
