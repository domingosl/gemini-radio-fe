import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from 'lucide-react';

const ClickableTooltip = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button onClick={() => setIsOpen(!isOpen)} className="ml-2 focus:outline-none">
                    <HelpCircle className="h-5 w-5 text-gray-500" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2">
                <p className="text-sm">{content}</p>
            </PopoverContent>
        </Popover>
    );
};

export default ClickableTooltip;