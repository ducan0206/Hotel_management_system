"use client";

import * as React from "react";
// KHÔNG c?n import ChevronLeft/Right n?a n?u b?n không dùng chúng trong components:
// import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { DayPicker } from "react-day-picker";

import { cn } from "../lib/utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        
        // S?A: ?i?u ch?nh nav ?? các nút ?i?u h??ng hi?n ?úng v? trí
        nav: "flex items-center absolute left-0 top-0 gap-1", 
        nav_button: cn(
          buttonVariants({ variant: "ghost" }), 
          // ??m b?o nút ?i?u h??ng luôn hi?n th? rõ ràng
          "size-7 bg-transparent p-0 opacity-100 hover:opacity-100", 
        ),
        // S?A: ??t nút Previous và Next c?nh nhau ? góc trái
        // Lo?i b? 'absolute' n?u b?n ?ã ??t 'nav' là absolute left-0 top-0
        nav_button_previous: "static", 
        nav_button_next: "static ml-2", // Thêm kho?ng cách nh?

        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      // LO?I B? KH?I components HOÀN TOÀN:
      // components={{ ... }}
      {...props}
    />
  );
}

export { Calendar };