// app/api/timesheets/route.ts
import { auth } from '../../auth'; // Import your newly exported auth method
import { NextRequest, NextResponse } from 'next/server';

const MOCK_TIMESHEETS = [
  { id: '1', week_number: 1, start_date: '2026-06-01', end_date: '2026-06-05', status: 'COMPLETED', total_hours: 40 },
  { id: '2', week_number: 2, start_date: '2026-06-08', end_date: '2026-06-12', status: 'COMPLETED', total_hours: 40 },
  { id: '3', week_number: 3, start_date: '2026-06-15', end_date: '2026-06-19', status: 'INCOMPLETE', total_hours: 32 },
  { id: '4', week_number: 4, start_date: '2026-06-22', end_date: '2026-06-26', status: 'COMPLETED', total_hours: 40 },
  { id: '5', week_number: 5, start_date: '2026-01-29', end_date: '2026-07-02', status: 'MISSING', total_hours: 0 },
];

export async function GET(request: NextRequest) {
  try {
    // Just call auth() with no parameters
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      timesheets: MOCK_TIMESHEETS,
      total: MOCK_TIMESHEETS.length,
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

    const newTimesheet = {
      id: String(MOCK_TIMESHEETS.length + 1),
      ...body,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(newTimesheet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}