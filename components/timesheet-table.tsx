"use client";

import { Timesheet } from "@/lib/types";
import { formatDate } from "@/lib/date-utils";
import { getStatusColor, getStatusBadgeText } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortField = "week_number" | "date";
type SortDir = "asc" | "desc";

interface Props {
  timesheets: Timesheet[];
  selectedTimesheetId?: string;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectTimesheet: (t: Timesheet) => void;
}

// ─── Action config per status ─────────────────────────────────────────────────

function ActionButton({
  status,
  onClick,
}: {
  status: string;
  onClick: () => void;
}) {
  const config: Record<string, { label: string; className: string }> = {
    completed: {
      label: "View",
      className: "text-blue-600 hover:text-blue-800",
    },
    incomplete: {
      label: "Update",
      className: "text-blue-600 hover:text-blue-800",
    },
    missing: {
      label: "Create",
      className: "text-blue-600 hover:text-blue-800",
    },
  };

  const c = config[status.toLowerCase()] ?? {
    label: "View",
    className: "text-blue-600 hover:text-blue-800",
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors cursor-pointer",
        c.className,
      )}
    >
      {c.label}
    </Button>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-700 border border-green-200",
    incomplete: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    missing: "bg-red-100 text-red-600 border border-red-200",
    pending: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  const labels: Record<string, string> = {
    completed: "COMPLETED",
    incomplete: "INCOMPLETE",
    missing: "MISSING",
    pending: "PENDING",
  };

  const key = status.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide",
        styles[key] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {labels[key] ?? status.toUpperCase()}
    </span>
  );
}

// ─── Paginator ────────────────────────────────────────────────────────────────

function Paginator({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const getPages = (): (number | "…")[] => {
    if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "…")[] = [];
    // Always show first
    pages.push(1);
    if (current > 4) pages.push("…");
    // Window around current
    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 3) pages.push("…");
    // Always show last
    pages.push(total);
    return pages;
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </Button>

      {getPages().map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
            ···
          </span>
        ) : (
          <Button
            key={p}
            onClick={() => onChange(p as number)}
            className={cn(
              "w-8 h-8 text-sm rounded transition-colors",
              p === current
                ? "bg-blue-600 text-white font-semibold"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50",
            )}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </Button>
    </div>
  );
}

// ─── Sort Header ──────────────────────────────────────────────────────────────

function SortableHead({
  label,
  field,
  sortField,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="flex flex-col">
          <ChevronUp
            className={cn(
              "h-2.5 w-2.5 -mb-0.5",
              active && sortDir === "asc" ? "text-blue-600" : "text-gray-300",
            )}
          />
          <ChevronDown
            className={cn(
              "h-2.5 w-2.5",
              active && sortDir === "desc" ? "text-blue-600" : "text-gray-300",
            )}
          />
        </span>
      </span>
    </th>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { label: "Status", value: "all" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Incomplete", value: "INCOMPLETE" },
  { label: "Missing", value: "MISSING" },
];

const DATE_RANGE_OPTIONS = [
  { label: "Date Range", value: "all" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
  { label: "Last month", value: "last_month" },
];

export function TimesheetTable({
  timesheets,
  selectedTimesheetId,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  onSelectTimesheet,
}: Props) {
  const [sortField, setSortField] = useState<SortField>("week_number");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [dateRange, setDateRange] = useState("all");
  const [perPage] = useState(5);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...timesheets].sort((a, b) => {
    let cmp = 0;
    if (sortField === "week_number") {
      cmp = a.week_number - b.week_number;
    } else {
      cmp = new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2 flex-col items-start ">
        <h2 className="text-lg font-semibold text-gray-900">Your Timesheets</h2>
        <div className="flex items-center gap-2">
          {/* Date Range filter */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {DATE_RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <SortableHead
                label="Week #"
                field="week_number"
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <SortableHead
                label="Date"
                field="date"
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No timesheets found.
                </td>
              </tr>
            ) : (
              sorted.map((timesheet) => (
                <tr
                  key={timesheet.id}
                  onClick={() => onSelectTimesheet(timesheet)}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedTimesheetId === timesheet.id &&
                      "bg-blue-50 hover:bg-blue-50",
                  )}
                >
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                    {timesheet.week_number}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {formatDate(timesheet.start_date)} –{" "}
                    {formatDate(timesheet.end_date)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={timesheet.status} />
                  </td>
                  <td className="text-right">
                    <ActionButton
                      status={timesheet.status}
                      onClick={() => onSelectTimesheet(timesheet)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <span>{perPage} per page</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <Paginator
          current={currentPage}
          total={totalPages}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
