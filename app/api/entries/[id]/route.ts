// app/api/entries/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../.././../auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ async in Next.js 15
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: entryId } = await params; // ✅ await params

    if (!entryId) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { project_name, task_description, type_of_work, hours, date, timesheet_id } = body;

    if (!project_name || !task_description || !hours || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: entryId } = await params;

    if (!entryId) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: entryId }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/entries/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}