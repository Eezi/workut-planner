"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isAfter,
	isBefore,
	isSameDay,
	isSameMonth,
	isToday,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns";
import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DateRange = {
	from: Date | undefined;
	to?: Date | undefined;
};

type BaseCalendarProps = {
	className?: string;
	showOutsideDays?: boolean;
	numberOfMonths?: number;
	defaultMonth?: Date;
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	disabled?: (date: Date) => boolean;
	/** Accepted for API compatibility with the previous react-day-picker Calendar. */
	initialFocus?: boolean;
};

type SingleCalendarProps = BaseCalendarProps & {
	mode?: "single";
	selected?: Date | undefined;
	onSelect?: (date: Date | undefined) => void;
};

type RangeCalendarProps = BaseCalendarProps & {
	mode: "range";
	selected?: DateRange | undefined;
	onSelect?: (range: DateRange | undefined) => void;
};

export type CalendarProps = SingleCalendarProps | RangeCalendarProps;

function Calendar(props: CalendarProps) {
	const {
		className,
		showOutsideDays = true,
		numberOfMonths = 1,
		defaultMonth,
		weekStartsOn = 0,
		disabled,
	} = props;
	const mode = props.mode ?? "single";

	const getInitialMonth = () => {
		if (defaultMonth) return startOfMonth(defaultMonth);
		if (mode === "range") {
			const range = props.selected as DateRange | undefined;
			if (range?.from) return startOfMonth(range.from);
		} else {
			const selected = props.selected as Date | undefined;
			if (selected) return startOfMonth(selected);
		}
		return startOfMonth(new Date());
	};

	const [month, setMonth] = React.useState<Date>(getInitialMonth);

	const handleDayClick = (day: Date) => {
		if (disabled?.(day)) return;

		if (props.mode === "range") {
			const range = props.selected;
			if (!range?.from || (range.from && range.to)) {
				props.onSelect?.({ from: day, to: undefined });
			} else if (isBefore(day, range.from)) {
				props.onSelect?.({ from: day, to: range.from });
			} else {
				props.onSelect?.({ from: range.from, to: day });
			}
		} else {
			props.onSelect?.(day);
		}
	};

	const getDayState = (day: Date) => {
		if (props.mode === "range") {
			const range = props.selected;
			const from = range?.from;
			const to = range?.to;
			const isStart = !!from && isSameDay(day, from);
			const isEnd = !!to && isSameDay(day, to);
			const isMiddle =
				!!from && !!to && isAfter(day, from) && isBefore(day, to);
			return { isSelected: isStart || isEnd, isMiddle };
		}
		const selected = props.selected as Date | undefined;
		return {
			isSelected: !!selected && isSameDay(day, selected),
			isMiddle: false,
		};
	};

	const renderMonth = (displayMonth: Date) => {
		const monthStart = startOfMonth(displayMonth);
		const gridStart = startOfWeek(monthStart, { weekStartsOn });
		const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn });
		const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
		const weekDays = days.slice(0, 7);

		const weeks: Date[][] = [];
		for (let i = 0; i < days.length; i += 7) {
			weeks.push(days.slice(i, i + 7));
		}

		return (
			<div key={displayMonth.toISOString()} className="space-y-4">
				<div className="relative flex items-center justify-center pt-1">
					<div className="text-sm font-medium">
						{format(displayMonth, "LLLL yyyy")}
					</div>
				</div>
				<table className="w-full border-collapse space-y-1">
					<thead>
						<tr className="flex">
							{weekDays.map((day) => (
								<th
									key={day.toISOString()}
									className="w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground"
									scope="col"
								>
									{format(day, "EEEEEE")}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{weeks.map((week) => (
							<tr key={week[0]?.toISOString()} className="mt-2 flex w-full">
								{week.map((day) => {
									const isOutside = !isSameMonth(day, monthStart);
									if (isOutside && !showOutsideDays) {
										return (
											<td key={day.toISOString()} className="h-8 w-8 p-0" />
										);
									}
									const { isSelected, isMiddle } = getDayState(day);
									const isDisabled = disabled?.(day) ?? false;
									return (
										<td
											key={day.toISOString()}
											className={cn(
												"relative p-0 text-center text-sm",
												isMiddle && "bg-accent",
												isMiddle && "first:rounded-l-md last:rounded-r-md",
											)}
										>
											<button
												type="button"
												disabled={isDisabled}
												onClick={() => handleDayClick(day)}
												className={cn(
													buttonVariants({ variant: "ghost" }),
													"h-8 w-8 p-0 font-normal",
													isOutside && "text-muted-foreground opacity-50",
													isToday(day) &&
														!isSelected &&
														!isMiddle &&
														"bg-accent text-accent-foreground",
													isMiddle &&
														"rounded-none bg-accent text-accent-foreground",
													isSelected &&
														"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
													isDisabled &&
														"pointer-events-none text-muted-foreground opacity-50",
												)}
											>
												{format(day, "d")}
											</button>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	const months = Array.from({ length: numberOfMonths }, (_, index) =>
		addMonths(month, index),
	);

	return (
		<div className={cn("relative p-3", className)}>
			<button
				type="button"
				aria-label="Previous month"
				onClick={() => setMonth(subMonths(month, 1))}
				className={cn(
					buttonVariants({ variant: "outline" }),
					"absolute left-4 top-4 z-10 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				)}
			>
				<ChevronLeftIcon className="h-4 w-4" />
			</button>
			<button
				type="button"
				aria-label="Next month"
				onClick={() => setMonth(addMonths(month, 1))}
				className={cn(
					buttonVariants({ variant: "outline" }),
					"absolute right-4 top-4 z-10 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				)}
			>
				<ChevronRightIcon className="h-4 w-4" />
			</button>
			<div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
				{months.map((displayMonth) => renderMonth(displayMonth))}
			</div>
		</div>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
