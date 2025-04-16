import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    const { content, userID, answerID } = await req.json();

    if (!content || !userID || !answerID) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Use WITH to chain the inserts in one atomic query.
    const result = await sql`
      WITH inserted_comment AS (
        INSERT INTO Comment (Content, UserID)
        VALUES (${content}, ${userID})
        RETURNING commentid, Content, UserID, Date
      )
      INSERT INTO CommentOnAnswer (CommentID, answerID)
      SELECT commentid, ${answerID} FROM inserted_comment
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(
        `Failed toinsert comment on answer with answerid=${answerID}`,
      );
    }

    const newComment = result[0];
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
