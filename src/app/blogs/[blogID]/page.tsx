import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSection } from "@/components/comment-section";
import { Heart, HeartCrack } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { neon } from "@neondatabase/serverless";
import { getClerkUserData } from "@/app/_actions/clerk";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ blogID: string }>;
}) {
  const blogID = parseInt((await params).blogID, 10);

  const sql = neon(process.env.DATABASE_URL!);

  const blog = (
    await sql`
    SELECT * FROM Blog
    WHERE blogid=${blogID}
  `
  )[0];
  if (!blog) notFound();

  const user = (
    await sql`
    SELECT * FROM Users
    WHERE userid=${blog["userid"]}
  `
  )[0];
  if (!user) notFound();
  const clerkCurrentUser = await getClerkUserData(user["clerkuserid"]);

  let currentComments = await sql`
    SELECT
      c.commentid, c.content, c.date, c.upvote, c.downvote, c.isdeleted, c.userid,
      u.name AS username, u.email AS useremail, u.clerkuserid
    FROM CommentOnBlog cb
    INNER JOIN Comment c ON cb.commentid = c.commentid
    INNER JOIN Users u ON c.userid = u.userid
    WHERE cb.blogid=${blogID}; -- Replace with desired resourceID
    `;

  currentComments = await Promise.all(
    currentComments.map(async (comment) => ({
      ...comment,
      userimgurl: (await getClerkUserData(comment["clerkuserid"]))?.imageUrl,
    })),
  );
  console.log(currentComments);

  return (
    <div className="flex justify-center">
      <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-6">
        <div className="flex gap-2 items-center">
          <Avatar className="w-[48px] h-[48px]">
            <AvatarImage src={clerkCurrentUser?.imageUrl} />
            <AvatarFallback>
              {user["email"].slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user["name"]}</span>
        </div>
        <h1 className="text-5xl font-bold">{blog["title"]}</h1>
        <p>Uploaded: {new Date(blog["datecreated"]).toDateString()}</p>
        <div className="flex space-x-4">
          <Toggle aria-label="Upvote" className="cursor-pointer">
            <Heart className="h-4 w-4" />
            {blog["upvote"]}
          </Toggle>
          <Toggle aria-label="Downvote" className="cursor-pointer">
            <HeartCrack className="h-4 w-4" />
            {blog["downvote"]}
          </Toggle>
        </div>
        <div className="space-y-[1em]">
          {blog["content"].split("\n\n").map((para: string, idx: number) => (
            <p key={idx}> {para} </p>
          ))}
        </div>
        <CommentSection comments={currentComments} blogID={blogID} />
      </main>
    </div>
  );
}
