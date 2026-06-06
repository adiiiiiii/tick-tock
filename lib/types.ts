export type TimesheetStatus = 'COMPLETED' | 'INCOMPLETE' | 'MISSING';

export interface Timesheet {
  id: string;
  week_number: number;
  start_date: string;
  end_date: string;
  status: TimesheetStatus;
  total_hours: number;
  created_at?: string;
  updated_at?: string;
}

export interface TimesheetEntry {
  id: string;
  timesheet_id: string;
  date: string;
  project_name: string;
  task_description: string;
  hours: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEntryInput {
  timesheet_id: string;
  date: string;
  project_name: string;
  task_description: string;
  hours: number;
}
