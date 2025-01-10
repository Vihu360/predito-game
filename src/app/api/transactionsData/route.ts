import { db } from '@/lib/dbConnect';
import { transactions } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    // Add null check
    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const getTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId)) // Now TypeScript knows userId is non-null
      .orderBy(desc(transactions.createdAt))
      .limit(10)
      .offset(0);

    // Check if any transactions were found
    if (getTransactions.length === 0) {
      return new Response('No transactions found', { status: 404 });
    }

    const transaction = getTransactions[0];
    return Response.json(transaction);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return new Response('Failed to fetch transactions', { status: 500 });
  }
}