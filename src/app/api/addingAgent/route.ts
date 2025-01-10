import { db } from "@/lib/dbConnect";
import { agents, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body email:", body.email);

    // Check if the user exists in the 'users' table

    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1)
      .execute();

    console.log("User record:", userRecord);

    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare agent data
    const user = userRecord[0];
    const newAgentData = {
      id: crypto.randomUUID(),
      name: user.name ?? 'agent',
      email: user.email,
      userId: user.id, 
    };

    // Insert into 'agents' table
    await db.insert(agents).values(newAgentData).execute();

    return NextResponse.json({ message: "Agent added successfully", agent: newAgentData });
  } catch (error) {
    console.error("Error adding agent:", error);
    return NextResponse.json({ error: "Error adding agent" }, { status: 500 });
  }
}
