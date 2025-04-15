import { notFound } from "next/navigation";
import PostBlogForm from "@/app/users/[userID]/_components/upload-blog-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getClerkUserData } from "@/app/_actions/clerk";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ userID: string }>;
}) {
  const userID = parseInt((await params).userID, 10);

  const sql = neon(process.env.DATABASE_URL!);

  const userRes = await sql`
    SELECT * FROM Users
    WHERE userid = ${userID}
  `;
  const user = userRes[0];
  if (!user) {
    notFound();
  }

  const clerkCurrentUser = await getClerkUserData(user["clerkuserid"]);

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
        <h1 className="text-5xl font-bold">Write a Blog</h1>
        <p>Share your thoughts, insights, or experiences with the community.</p>
        <PostBlogForm userID={userID} />
      </main>
    </div>
  );
}
