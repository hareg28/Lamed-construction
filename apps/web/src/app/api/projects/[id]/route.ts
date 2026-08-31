import { NextResponse } from 'next/server';
import { getProject, updateProject, deleteProject } from '@/lib/serverStorage';

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
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const project = getProject(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.clientName !== undefined) updateData.clientName = body.clientName;
    if (body.contractValue !== undefined) updateData.contractValue = Number(body.contractValue);
    if (body.startDate !== undefined) updateData.startDate = body.startDate;
    if (body.endDate !== undefined) updateData.endDate = body.endDate;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.gallery !== undefined) {
      updateData.gallery = Array.isArray(body.gallery) ? body.gallery : body.gallery.split('\n').filter(Boolean);
    }
    if (body.featured !== undefined) updateData.featured = body.featured;

    const updated = updateProject(params.id, updateData);
    return NextResponse.json({ success: true, data: updated });
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
    const deleted = deleteProject(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
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
