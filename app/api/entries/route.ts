import { auth } from '../../auth'; // Import your newly exported auth method
import { NextRequest, NextResponse } from 'next/server';

const MOCK_ENTRIES = [
  {
    id: '1',
    timesheet_id: '1',
    date: '2026-06-01',
    project_name: 'Tick tock App',
    task_description: 'UI Components',
    hours: 4,
    created_at: '2024-01-21T09:00:00Z',
  },
  {
    id: '2',
    timesheet_id: '1',
    date: '2026-06-01',
    project_name: 'Tick tock App',
    task_description: 'API Integration',
    hours: 4,
    created_at: '2024-01-22T09:00:00Z',
  },
  {
    id: '3',
    timesheet_id: '1',
    date: '2026-06-02',
    project_name: 'Tick tock App',
    task_description: 'Testing and QA',
    hours: 4,
    created_at: '2024-01-23T09:00:00Z',
  },
  {
    id: '4',
    timesheet_id: '1',
    date: '2026-06-02',
    project_name: 'Tick tock App',
    task_description: 'Bug Fixes',
    hours: 4,
    created_at: '2024-01-24T09:00:00Z',
  },
  {
    id: '5',
    timesheet_id: '1',
    date: '2026-06-02',
    project_name: 'Tick tock App',
    task_description: 'Documentation',
    hours: 4,
    created_at: '2024-01-25T09:00:00Z',
  },
    {
    id: '6',
    timesheet_id: '1',
    date: '2026-06-03',
    project_name: 'Tick tock App',
    task_description: 'Documentation-update',
    hours: 4,
    created_at: '2024-01-25T09:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timesheetId = searchParams.get('timesheetId');

    let entries = MOCK_ENTRIES;
    if (timesheetId) {
      entries = entries.filter((e) => e.timesheet_id === timesheetId);
    }

    return NextResponse.json({
      entries,
      total: entries.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const newEntry = {
      id: String(MOCK_ENTRIES.length + 1),
      ...body,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entryId = params.id;

    if (!entryId) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { project_name, task_description, type_of_work, hours, date, timesheet_id } = body;

    if (!project_name || !task_description || !hours || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Echo back the updated entry so the frontend can update state
    const updated = {
      id: entryId,
      timesheet_id,
      project_name,
      task_description,
      type_of_work: type_of_work ?? null,
      hours: Number(hours),
      date,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/entries/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}