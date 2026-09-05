"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TSetDate = (date: Date) => void;
export type SetDate = TSetDate | React.Dispatch<React.SetStateAction<Date>>;
export function DatePicker({
	date,
	setDate,
}: {
	date: Date;
	setDate: SetDate;
}) {
	const [open, setOpen] = React.useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[240px] justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={(selected) => {
						if (selected) {
							(setDate as TSetDate)(selected);
							setOpen(false);
						}
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
