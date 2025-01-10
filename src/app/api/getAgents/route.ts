import { db } from "@/lib/dbConnect";
import { agents } from "@/lib/schema";
import { NextResponse } from "next/server";


export async function GET() {
    try {

        const allData = await db.select().from(agents)
    
      return NextResponse.json(allData);

    } catch (error) {

      console.error('Error fetching agents:', error);
      return NextResponse.error();
      
    }
}