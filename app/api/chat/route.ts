import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const answer = question
      ? `Sorunuz: "${question}". EasyChat asistanı kısa süre içinde yanıt verecek.`
      : 'Bir soru gelmedi, lütfen tekrar deneyin.';

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error: 'Soru işlenemedi.' }, { status: 400 });
  }
}
