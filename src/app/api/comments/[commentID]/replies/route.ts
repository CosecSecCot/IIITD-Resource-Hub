import { getClerkUserData } from "@/app/_actions/clerk";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { commentID: string } },
) {
  try {
    const commentID = parseInt(params.commentID, 10);
    if (isNaN(commentID)) {
      return NextResponse.json({ error: "Invalid commentID" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Query for replies by joining the CommentOnComment, Comment, and Users tables.
    let replies = await sql`
      SELECT
        c.commentid, c.content, c.date, c.upvote, c.downvote, c.isdeleted,
        u.email AS useremail, u.name AS username, u.clerkuserid
      FROM CommentOnComment cc
      INNER JOIN Comment c ON cc.CommentID = c.CommentID
      INNER JOIN Users u ON c.userid = u.userid
      WHERE cc.ParentCommentID = ${commentID};
    `;

    replies = await Promise.all(
      replies.map(async (reply) => {
        const clerkData = await getClerkUserData(reply["clerkuserid"]);
        return {
          ...reply,
          userimgurl: clerkData?.imageUrl || "",
          noReplies: false,
        };
      }),
    );

    return NextResponse.json(replies, { status: 200 });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 },
    );
  }
}
