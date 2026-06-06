"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Timesheet, TimesheetEntry } from "@/lib/types";

interface EntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timesheet: Timesheet | null;
  entry?: TimesheetEntry | null;
  addEntryDate?: string | null;
  onSubmit: (entry: any) => Promise<void>;
}

export function EntryModal({
  open,
  onOpenChange,
  timesheet,
  entry,
  addEntryDate,
  onSubmit,
}: EntryModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    project_name: "",
    task_description: "",
    hours: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Remove this existing effect

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date,
        project_name: entry.project_name,
        task_description: entry.task_description,
        hours: entry.hours.toString(),
      });
    } else {
      setFormData({
        date: "",
        project_name: "",
        task_description: "",
        hours: "",
      });
    }
  }, [entry, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.project_name || !formData.hours) {
      return;
    }

    const hours = parseFloat(formData.hours);
    if (hours <= 0 || hours > 24) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        date: entry ? entry.date : (addEntryDate ?? formData.date),
        hours,
        timesheet_id: timesheet?.id,
      };

      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit Entry" : "Add New Entry"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project" className="text-sm font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="project"
              placeholder="e.g., Homepage Development"
              value={formData.project_name}
              onChange={(e) =>
                setFormData({ ...formData, project_name: e.target.value })
              }
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="task" className="text-sm font-medium">
              Task Description
            </label>
            <Textarea
              id="task"
              placeholder="Write text here..."
              value={formData.task_description}
              onChange={(e) =>
                setFormData({ ...formData, task_description: e.target.value })
              }
              disabled={isLoading}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="hours" className="text-sm font-medium">
              Hours <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = parseFloat(formData.hours) || 0;
                  if (current > 0) {
                    setFormData({
                      ...formData,
                      hours: (current - 0.5).toString(),
                    });
                  }
                }}
                disabled={isLoading}
              >
                −
              </Button>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="0"
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
                }
                disabled={isLoading}
                className="text-center w-16"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = parseFloat(formData.hours) || 0;
                  if (current < 24) {
                    setFormData({
                      ...formData,
                      hours: (current + 0.5).toString(),
                    });
                  }
                }}
                disabled={isLoading}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-2 justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              {isLoading ? "Saving..." : entry ? "Update entry" : "Add entry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
