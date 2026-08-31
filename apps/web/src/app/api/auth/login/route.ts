import { NextResponse } from 'next/server';
import { verifyCredentials, generateToken } from '@/lib/auth';
import { verifyAdmin } from '@/lib/serverStorage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await verifyAdmin(email, password);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken(admin);

    const res = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

    res.cookies.set({
      name: 'lamed_auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
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
