import { db } from "@/lib/dbConnect";
import { agents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    
    // Extract agentId from search params
    const agentId = req.nextUrl.searchParams.get("agentId");

    console.log("Agent ID:", agentId);

    // Validate agentId
    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" }, 
        { status: 400 }
      );
    }

    // Delete the agent from the database
    const result = await db
      .delete(agents)
      .where(eq(agents.id, agentId))
      .returning({ deletedId: agents.id });

    // Check if any rows were deleted
    if (!result.length) {
      return NextResponse.json(
        { error: "Agent not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Agent deleted successfully",
      deletedId: result[0].deletedId
    });

  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Error deleting agent" }, 
      { status: 500 }
    );
  }
}