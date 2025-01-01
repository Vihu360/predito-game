import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/dbConnect";
import { credits } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const userCredits = await db
      .select()
      .from(credits)
      .where(eq(credits.userId, userId))
      .limit(1);

    if (!userCredits || userCredits.length === 0) {
      return NextResponse.json(
        { message: 'User credits not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { credits: userCredits[0].amount },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking credits:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
