"skip ssr";
import { ArrowRight, CalendarDays, Dumbbell, Loader2 } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { PageHead } from "../components/Head";

type PageProps = {};

const Home: NextPage = (props: PageProps) => {
	const { data: sessionData, status } = useSession();
	return (
		<>
			<PageHead title="Workout Plan" />
			<div className="flex min-h-[80vh] flex-col items-center justify-center gap-12 px-4 py-16">
				<div className="flex flex-col items-center gap-3 text-center">
					<h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
						Workout <span className="text-primary">Plan</span>
					</h1>
					<p className="max-w-sm text-base text-white/50">
						Track your sessions, manage your workouts, and stay consistent.
					</p>
				</div>

				{status === "loading" ? (
					<Loader2 className="h-6 w-6 animate-spin text-primary" />
				) : (
					<>
						{sessionData && (
							<div className="grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
								<Link
									className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-white transition-all hover:border-primary/40 hover:bg-white/10 sm:gap-3 sm:rounded-2xl sm:p-6"
									href="/workout-sessions"
								>
									<div className="flex items-center justify-between">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 sm:h-10 sm:w-10 sm:rounded-xl">
											<CalendarDays className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
										</div>
										<ArrowRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
									</div>
									<div>
										<h3 className="text-base font-semibold sm:text-lg">
											Sessions
										</h3>
										<p className="text-xs text-white/40 sm:text-sm">
											View your workout history
										</p>
									</div>
								</Link>
								<Link
									className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-white transition-all hover:border-primary/40 hover:bg-white/10 sm:gap-3 sm:rounded-2xl sm:p-6"
									href="/allworkouts"
								>
									<div className="flex items-center justify-between">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 sm:h-10 sm:w-10 sm:rounded-xl">
											<Dumbbell className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
										</div>
										<ArrowRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
									</div>
									<div>
										<h3 className="text-base font-semibold sm:text-lg">
											Workouts
										</h3>
										<p className="text-xs text-white/40 sm:text-sm">
											Browse and manage exercises
										</p>
									</div>
								</Link>
							</div>
						)}
						<AuthShowcase sessionDataExists={!!sessionData} />
					</>
				)}
			</div>
		</>
	);
};

export default Home;

const AuthShowcase = ({
	sessionDataExists,
}: {
	sessionDataExists: boolean;
}) => {
	if (sessionDataExists) {
		return null;
	}
	return (
		<Button
			size="lg"
			onClick={sessionDataExists ? () => signOut() : () => signIn("google")}
		>
			{sessionDataExists ? "Sign out" : "Sign in with Google"}
		</Button>
	);
};
