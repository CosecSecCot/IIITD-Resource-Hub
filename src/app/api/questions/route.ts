import { getClerkUserData } from "@/app/_actions/clerk";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { userID, question } = await req.json();

    const result = await sql`
      INSERT INTO Questions (UserID, Content)
      VALUES (${userID}, ${question})
      RETURNING *;
    `;

    const newQuestion = result[0];

    return new Response(JSON.stringify(newQuestion), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return new Response(JSON.stringify({ error: "Failed to create blog" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    let result = await sql`
      SELECT 
        q.questionid, q.content, q.dateasked, q.upvote, q.downvote,
        u.email AS useremail, u.name AS username, u.clerkuserid
      FROM Questions q
      INNER JOIN Users u ON q.userid = u.userid;
    `;

    result = await Promise.all(
      result.map(async (question) => {
        const clerkData = await getClerkUserData(question.clerkuserid);
        return {
          ...question,
          userimgurl: clerkData?.imageUrl || "",
        };
      }),
    );

    return NextResponse.json(result, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
