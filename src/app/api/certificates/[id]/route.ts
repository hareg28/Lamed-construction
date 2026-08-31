import { NextResponse } from 'next/server';
import { deleteCertificate } from '@/lib/serverStorage';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteCertificate(params.id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
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
