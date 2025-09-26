import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(
      {
        ok: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('API Error: ', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
