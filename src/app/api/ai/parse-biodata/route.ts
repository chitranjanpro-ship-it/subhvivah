import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock parsed data
    const mockParsedData = {
      name: "Rahul Sharma",
      age: 28,
      gender: "MALE",
      religion: "Hindu",
      caste: "Brahmin",
      height: 175,
      location: "Jamshedpur, Jharkhand",
      education: "B.Tech in Computer Science",
      occupation: "Software Engineer",
      company: "Tata Steel",
      income: 1200000,
      bio: "A simple, family-oriented person looking for a life partner who values traditions.",
    };

    return NextResponse.json({ 
      message: 'Biodata parsed successfully', 
      data: mockParsedData 
    });
  } catch (error) {
    console.error('Biodata parsing error:', error);
    return NextResponse.json({ message: 'Failed to parse biodata' }, { status: 500 });
  }
}
