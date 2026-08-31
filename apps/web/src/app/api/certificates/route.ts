import { NextResponse } from 'next/server';
import { getCertificates, createCertificate } from '@/lib/serverStorage';

export async function GET() {
  try {
    const certificates = getCertificates();
    return NextResponse.json({ success: true, data: certificates });
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

    if (!body.title || !body.image) {
      return NextResponse.json(
        { success: false, error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    const cert = createCertificate({
      title: body.title,
      image: body.image,
      issuer: body.issuer,
      year: body.year,
      description: body.description,
    });

    return NextResponse.json({ success: true, data: cert }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
