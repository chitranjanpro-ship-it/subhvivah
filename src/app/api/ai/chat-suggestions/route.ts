import { NextResponse } from 'next/server';
import { getSuggestions, SuggestionCategory } from '@/lib/chat-ai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') || 'STARTER') as SuggestionCategory;

    const suggestions = await getSuggestions(category);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Fetch suggestions error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
