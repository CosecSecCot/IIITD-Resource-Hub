import { getClerkUserData } from "@/app/_actions/clerk";
import { extractGoogleDriveFileID } from "@/app/_actions/utils";
import { CommentSection } from "@/components/comment-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { neon } from "@neondatabase/serverless";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ resourceID: string }>; // resourceID from the URL
}) {
  const resourceID = parseInt((await params).resourceID, 10);

  const sql = neon(process.env.DATABASE_URL!);

  const resource = (
    await sql`
    SELECT * FROM Resource
    WHERE resourceid=${resourceID}
  `
  )[0];
  if (!resource) notFound();

  const resourcefiles = await sql`
    SELECT * FROM ResourceFile
    WHERE resourceid=${resourceID}
  `;
  console.log(resourcefiles);

  const user = (
    await sql`
    SELECT * FROM Users
    WHERE userid=${resource["userid"]}
  `
  )[0];
  if (!user) notFound();
  const clerkCurrentUser = await getClerkUserData(user["clerkuserid"]);

  let currentComments = await sql`
    SELECT
      c.commentid, c.content, c.date, c.upvote, c.downvote, c.isdeleted, c.userid,
      u.name AS username, u.email AS useremail, u.clerkuserid
    FROM CommentOnResource cr
    INNER JOIN Comment c ON cr.commentid = c.commentid
    INNER JOIN Users u ON c.userid = u.userid
    WHERE cr.resourceid=${resourceID}; -- Replace with desired resourceID
    `;

  currentComments = await Promise.all(
    currentComments.map(async (comment) => ({
      ...comment,
      userimgurl: (await getClerkUserData(comment["clerkuserid"]))?.imageUrl,
    })),
  );
  console.log(currentComments);

  return (
    <div>
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
          <h1 className="text-5xl font-bold">{resource.title}</h1>
          <p className="break-all">
            {resource.description}
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam placeat
            nobis saepe illo delectus vel cumque pariatur aspernatur laudantium
            facilis est minima reiciendis magni facere voluptatibus, suscipit
            nisi numquam explicabo?
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge>{resource.type}</Badge>
            <Badge variant="secondary">{resource.subject}</Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span>{resource.year ? resource.year : ""}</span>
            <span>
              {resource.semester ? `Semester ${resource.semester}` : ""}
            </span>
          </div>
          <div className="w-full flex gap-6 flex-wrap">
            {resourcefiles.map((file, idx) => (
              <Link
                href={file["url"]}
                key={idx}
                target="_blank"
                className="relative min-w-[192px] aspect-square rounded-xl overflow-hidden flex justify-center"
              >
                <div className="absolute top-[50%] left-[50%] rounded-full bg-secondary opacity-50 p-6">
                  <Download />
                </div>
                <Image
                  width={1}
                  height={1}
                  src={`https://drive.google.com/thumbnail?id=${extractGoogleDriveFileID(file["url"])}`}
                  alt=""
                  className="w-full h-full"
                />
              </Link>
            ))}
          </div>
          <CommentSection comments={currentComments} resourceID={resourceID} />
        </main>
      </div>
    </div>
  );
}
