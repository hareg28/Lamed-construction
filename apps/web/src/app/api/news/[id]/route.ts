import { NextResponse } from 'next/server';
import { getNewsItem, updateNews, deleteNews } from '@/lib/serverStorage';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = getNewsItem(params.id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'News post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: post });
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
    const post = getNewsItem(params.id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'News post not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.publishedAt !== undefined) updateData.publishedAt = body.publishedAt;

    const updated = updateNews(params.id, updateData);
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
    const deleted = deleteNews(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'News post not found' },
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
