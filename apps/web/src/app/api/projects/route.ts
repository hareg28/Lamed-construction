import { NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/serverStorage';
import type { ProjectStatus, ProjectType } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as ProjectStatus | null;
    const type = searchParams.get('type') as ProjectType | null;
    const featured = searchParams.get('featured');

    let projects = getProjects();

    if (status) {
      projects = projects.filter((p) => p.status === status);
    }
    if (type) {
      projects = projects.filter((p) => p.type === type);
    }
    if (featured !== null) {
      const isFeatured = featured === 'true';
      projects = projects.filter((p) => p.featured === isFeatured);
    }

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requiredFields = [
      'title',
      'description',
      'type',
      'status',
      'clientName',
      'contractValue',
      'startDate',
      'location',
      'coverImage',
    ];
    const missing = requiredFields.filter((f) => !(f in body));
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const project = createProject({
      title: body.title,
      description: body.description,
      shortDescription: body.shortDescription || body.description.slice(0, 200),
      type: body.type,
      status: body.status,
      clientName: body.clientName,
      contractValue: Number(body.contractValue),
      startDate: body.startDate,
      endDate: body.endDate,
      location: body.location,
      coverImage: body.coverImage,
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      featured: body.featured ?? false,
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
