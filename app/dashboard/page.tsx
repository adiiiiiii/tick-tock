"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Timesheet, TimesheetEntry } from "@/lib/types";
import { TimesheetDetailView } from "@/components/timesheet-detail-view";
import { EntryModal } from "@/components/entry-modal";
import { TimesheetTable } from "@/components/timesheet-table";

const PAGE_SIZE = 5;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimesheetEntry | null>(
    null,
  );
  const [addEntryDate, setAddEntryDate] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    try {
      const res = await fetch("/api/timesheets");
      const data = await res.json();
      setTimesheets(data.timesheets);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const selectTimesheet = async (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    try {
      const res = await fetch(`/api/entries?timesheetId=${timesheet.id}`);
      const data = await res.json();
      setEntries(data.entries);
    } catch (error) {}
  };

  const handleAddEntry = async (formData: any) => {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const newEntry = await res.json();
    setEntries((prev) => [...prev, newEntry]);
  };

  const handleUpdateEntry = async (formData: any) => {
    if (!selectedEntry) return;
    const res = await fetch(`/api/entries/${selectedEntry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const updated = await res.json();
    setEntries((prev) =>
      prev.map((e) => (e.id === selectedEntry.id ? updated : e)),
    );
  };

  const handleDeleteEntry = async (entryId: string) => {
    await fetch(`/api/entries/${entryId}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  // Filtering
  const filteredTimesheets = timesheets.filter((t) => {
    const statusMatch = statusFilter === "all" || t.status === statusFilter;
    return statusMatch;
  });

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTimesheets.length / PAGE_SIZE),
  );
  const paginatedTimesheets = filteredTimesheets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Reset page on filter change
  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-500">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-gray-900">ticktock</h1>
            <span className="text-sm text-gray-500">Timesheets</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-900">
              {session.user?.name || "User"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <TimesheetTable
          timesheets={paginatedTimesheets}
          selectedTimesheetId={selectedTimesheet?.id}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilter}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onSelectTimesheet={selectTimesheet}
        />

        {selectedTimesheet && (
          <TimesheetDetailView
            timesheet={selectedTimesheet}
            entries={entries}
            onAddEntry={(date) => {
              setSelectedEntry(null);
              setAddEntryDate(date);
              setModalOpen(true);
            }}
            onEditEntry={(entry) => {
              setSelectedEntry(entry);
              setModalOpen(true);
            }}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-5 text-center text-sm text-gray-500">
          © 2024 tentwenty. All rights reserved.
        </div>
      </footer>

      <EntryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        timesheet={selectedTimesheet}
        entry={selectedEntry}
        addEntryDate={addEntryDate}
        onSubmit={selectedEntry ? handleUpdateEntry : handleAddEntry}
      />
    </div>
  );
}
