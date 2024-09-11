import React from 'react';
import { format, parse, setSeconds } from 'date-fns';
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ date, setDate }) => {
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  const handleTimeChange = (hour: number, minute: number) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(hour, minute);
    // Set seconds to 0 for consistency
    setDate(setSeconds(newDate, 0));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {date ? format(date, 'HH:mm:ss') : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex p-2">
          <div className="flex flex-col mr-2">
            <div className="text-sm font-semibold mb-1">Hour</div>
            <div className="grid grid-cols-4 gap-2 h-[200px] overflow-y-auto">
              {hourOptions.map((hour) => (
                <Button
                  key={hour}
                  size="sm"
                  variant='outline'
                  onClick={() => handleTimeChange(hour, date?.getMinutes() || 0)}
                  className={cn(
                    date?.getHours() === hour && "bg-primary text-primary-foreground"
                  )}
                >
                  {hour.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-1">Minute</div>
            <div className="grid grid-cols-4 gap-2 h-[200px] overflow-y-auto">
              {minuteOptions.map((minute) => (
                <Button
                  key={minute}
                  size="sm"
                  variant='outline'
                  onClick={() => handleTimeChange(date?.getHours() || 0, minute)}
                  className={cn(
                    date?.getMinutes() === minute && "bg-primary text-primary-foreground"
                  )}
                >
                  {minute.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;