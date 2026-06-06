"use client";

import { TimesheetEntry, Timesheet } from "@/lib/types";
import { formatDate } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  timesheet: Timesheet;
  entries: TimesheetEntry[];
  onAddEntry: (date: string) => void;
  onEditEntry: (entry: TimesheetEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export function TimesheetDetailView({
  timesheet,
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}: Props) {
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const targetHours = 40;
  const progressPct = Math.min((totalHours / targetHours) * 100, 100);

  // Group entries by date
  const grouped = entries.reduce<Record<string, TimesheetEntry[]>>(
    (acc, entry) => {
      const key = entry.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {},
  );

  const allDates: string[] = [];
  const start = new Date(timesheet.start_date);
  const end = new Date(timesheet.end_date);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    allDates.push(d.toISOString().split("T")[0]);
  }

  return (
    <div className="mt-8 border border-blue-300 rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            This week&apos;s timesheet
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDate(timesheet.start_date)} –{" "}
            {formatDate(timesheet.end_date)}
          </p>
        </div>
        <div className="text-right min-w-[120px]">
          <span className="text-sm font-semibold text-gray-800">
            {totalHours}/{targetHours} hrs
          </span>
          <div className="mt-1 h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {Math.round(progressPct)}%
          </span>
        </div>
      </div>

      {/* Grouped entries */}
      <div className="mt-6 space-y-6">
        {allDates.map((date) => {
          const dayEntries = grouped[date] || [];
          const label = new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div key={date}>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {label}
              </p>
              <div className="space-y-2">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-800 flex-1">
                      {entry.task_description}
                    </span>
                    <span className="text-sm text-gray-500 mr-4">
                      {entry.hours} hrs
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-3">
                      {entry.project_name}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditEntry(entry)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDeleteEntry(entry.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                {/* Add new task row */}
                <Button
                  onClick={() => onAddEntry(date)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-blue-300 text-blue-500 text-sm hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add new task
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
