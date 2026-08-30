import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
	children: React.ReactNode;
	Content: React.ReactNode;
}

export const Collapse = ({ children, Content }: Props) => (
	<Accordion type="single" collapsible className="w-full">
		<AccordionItem value="item-1" className="border-none">
			<AccordionTrigger className="p-0">{children}</AccordionTrigger>
			<AccordionContent>{Content}</AccordionContent>
		</AccordionItem>
	</Accordion>
);
