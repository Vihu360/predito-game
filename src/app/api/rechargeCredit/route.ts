import { db } from "@/lib/dbConnect";
import { createTransaction } from "@/lib/schema";
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, amount } = body;

        const transaction = await createTransaction(db, {
            id: nanoid(),
            userId,
            type: 'recharge',
            amount,
            paymentMethod: 'paypal', 
            description: 'Credit Recharge', 
        });

        return Response.json(transaction);
    } catch (error) {
        console.error(error);
        return new Response('Failed to create transaction', { status: 500 });
    }
}   