import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/dbConnect";
import { credits } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, prediction, outcome, betAmount, won } = body;

    if (!userId || !prediction || !outcome || !betAmount) {
      return NextResponse.json(
        { message: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const creditManage = await db
      .select()
      .from(credits)
      .where(eq(credits.userId, userId))
      .limit(1);

    if (!creditManage || creditManage.length === 0) {
      return NextResponse.json(
        { message: 'User credits not found' }, 
        { status: 404 }
      );
    }

    const currentCredits = creditManage[0].amount;
    const newAmount = won ? currentCredits + betAmount : currentCredits - betAmount;

    if (!won && newAmount < 0) {
      return NextResponse.json(
        { message: 'Insufficient credits' }, 
        { status: 400 }
      );
    }

    await db
      .update(credits)
      .set({ amount: newAmount })
      .where(eq(credits.userId, userId));

    return NextResponse.json({ 
      success: true, 
      newBalance: newAmount 
    });

  } catch (error) {
    console.error('Error managing credits:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}