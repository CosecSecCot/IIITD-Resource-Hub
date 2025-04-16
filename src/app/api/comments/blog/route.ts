import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { content, userID, blogID } = await req.json();

    if (!content || !userID || !blogID) {
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
      INSERT INTO CommentOnBlog (CommentID, BlogID)
      SELECT commentid, ${blogID} FROM inserted_comment
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Failed toinsert comment on blog with blogid=${blogID}`);
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
