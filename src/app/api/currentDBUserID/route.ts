import { currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "No current user" }, { status: 404 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`
      SELECT * FROM Users
      WHERE clerkuserid=${user.id}
    `;

    const dbUser = result[0];
    if (!dbUser) {
      return NextResponse.json({ error: "DB user not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching DB user:", error);
    return NextResponse.json(
      { error: "Failed to fetch DB user" },
      { status: 500 },
    );
  }
}
