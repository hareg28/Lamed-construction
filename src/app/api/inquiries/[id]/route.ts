import { NextResponse } from 'next/server';
import { getInquiry, updateInquiry, deleteInquiry } from '@/lib/serverStorage';
import type { InquiryStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = getInquiry(params.id);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = getInquiry(params.id);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validStatuses: InquiryStatus[] = ['unread', 'read', 'replied'];

    if (body.status && validStatuses.includes(body.status)) {
      const updated = updateInquiry(params.id, { status: body.status });
      return NextResponse.json({ success: true, data: updated });
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.service !== undefined) updateData.service = body.service;
    if (body.message !== undefined) updateData.message = body.message;

    if (Object.keys(updateData).length === 0 && !body.status) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing fields' },
        { status: 400 }
      );
    }

    const updated = updateInquiry(params.id, updateData);
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
    const deleted = deleteInquiry(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
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
