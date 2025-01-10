import { db } from "@/lib/dbConnect";
import { users } from "@/lib/schema";
import { NextResponse } from "next/server";


export async function GET() {
   
    try {

        const allData = await db.select().from(users)

        return NextResponse.json(allData);
        
    } catch (error) {

        console.log(error);
       return NextResponse.json({error});
        
    }
}