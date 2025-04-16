import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ userID: string }> },
) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const userID = parseInt((await params).userID, 10);

    // Update the blog where BlogID matches.
    const result = await sql`
      SELECT * FROM Users
      WHERE UserID=${userID}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const user = result[0];
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error finding user:", error);
    return NextResponse.json({ error: "Failed to find user" }, { status: 500 });
  }
}
