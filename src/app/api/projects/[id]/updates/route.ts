import { NextResponse } from 'next/server';
import { getProject, getUpdates, createUpdate, deleteUpdate } from '@/lib/serverStorage';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = getProject(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    const updates = getUpdates(params.id);
    return NextResponse.json({ success: true, data: updates });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = getProject(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (!body.date || !body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Date, title, and description are required' },
        { status: 400 }
      );
    }

    const update = createUpdate(params.id, {
      date: body.date,
      title: body.title,
      description: body.description,
      image: body.image,
    });

    return NextResponse.json({ success: true, data: update }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const updateId = searchParams.get('updateId');

    if (!updateId) {
      const body = await request.json().catch(() => ({}));
      const uid = body?.updateId;
      if (!uid) {
        return NextResponse.json(
          { success: false, error: 'updateId is required' },
          { status: 400 }
        );
      }
      const deleted = deleteUpdate(params.id, uid);
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Update not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    const deleted = deleteUpdate(params.id, updateId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Update not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
