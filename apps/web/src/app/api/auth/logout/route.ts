import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: 'lamed_auth_token',
      value: '',
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
