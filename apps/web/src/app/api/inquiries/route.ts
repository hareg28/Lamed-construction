import { NextResponse } from 'next/server';
import { getInquiries, createInquiry } from '@/lib/serverStorage';
import { sendEmailNotification } from '@/lib/email';
import { sendTelegramNotification } from '@/lib/telegram';

export async function GET() {
  try {
    const inquiries = getInquiries();
    return NextResponse.json({ success: true, data: inquiries });
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

    const requiredFields = ['name', 'email', 'message'];
    const missing = requiredFields.filter((f) => !(f in body));
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const inquiry = createInquiry({
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service,
      message: body.message,
    });

    const notificationPayload = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service,
      message: body.message,
    };

    // Fire-and-forget: notify via email and Telegram (never blocks the response)
    sendEmailNotification(notificationPayload).catch(() => {/* silently ignored */});
    sendTelegramNotification(notificationPayload).catch(() => {/* silently ignored */});

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
