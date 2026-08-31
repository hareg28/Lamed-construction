import { NextResponse } from 'next/server';
import { getNews, createNews } from '@/lib/serverStorage';

export async function GET() {
  try {
    const news = getNews();
    return NextResponse.json({ success: true, data: news });
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

    const requiredFields = ['title', 'excerpt', 'content', 'category', 'coverImage', 'author'];
    const missing = requiredFields.filter((f) => !(f in body));
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const post = createNews({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      coverImage: body.coverImage,
      author: body.author,
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
