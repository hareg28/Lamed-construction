import { NextResponse } from 'next/server';
import {
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '@/lib/serverStorage';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional().or(z.literal('')),
});

export async function GET() {
  try {
    const users = listAdminUsers();
    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to list admin users' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }
    const result = await createAdminUser(parsed.data);
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, user: result });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...rest } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'User id is required' }, { status: 400 });
    }
    const parsed = updateSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }
    const data = { ...parsed.data };
    if (data.password === '') delete data.password;
    const result = await updateAdminUser(id, data);
    if (result === null) {
      return NextResponse.json({ success: false, error: 'Admin user not found' }, { status: 404 });
    }
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, user: result });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to update admin user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'User id is required' }, { status: 400 });
    }
    const ok = deleteAdminUser(id);
    if (!ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Could not delete admin. Ensure at least one admin account remains.',
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete admin user' },
      { status: 500 }
    );
  }
}
