import { getClerkUserData } from "@/app/_actions/clerk";
import UploadResourceForm from "@/app/users/[userID]/_components/upload-resource-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ userID: string }>; // userID from the URL
}) {
  const res = await params;
  const userID = parseInt(res.userID, 10);
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
          <span>{user.name}</span>
        </div>
        <h1 className="text-5xl font-bold">Upload A Resource</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam placeat
          nobis saepe illo delectus vel cumque pariatur aspernatur laudantium
          facilis est minima reiciendis magni facere voluptatibus, suscipit nisi
          numquam explicabo?
        </p>
        <UploadResourceForm userID={userID} />
      </main>
    </div>
  );
}
