import UploadResourceForm from "@/app/users/[userID]/_components/upload-resource-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import users from "@/data/users";
import resources from "@/data/resources";
import { notFound } from "next/navigation";
import resourceFiles from "@/data/resource-files";
import { getClerkUserData } from "@/app/_actions/clerk";
import { neon } from "@neondatabase/serverless";
import { init } from "next/dist/compiled/webpack/webpack";

export default async function Page({
  params,
}: {
  params: Promise<{ userID: string; resourceID: string }>;
}) {
  const resolvedParams = await params;
  const userID = parseInt(resolvedParams.userID, 10);
  const resourceID = parseInt(resolvedParams.resourceID, 10);

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

  const resourceToEditRes = await sql`
    SELECT * FROM Resource
    WHERE resourceid = ${resourceID} AND userid = ${userID};
  `;
  const resourceToEdit = resourceToEditRes[0];
  if (!resourceToEdit) {
    notFound();
  }

  let resourceFilesForResource = await sql`
    SELECT * FROM ResourceFile
    WHERE resourceid = ${resourceID};
  `;

  resourceFilesForResource = resourceFilesForResource.map(
    (resFile) => resFile["url"],
  );

  console.log(resourceFilesForResource);

  const initialData = {
    ...resourceToEdit,
    resourceFiles: resourceFilesForResource,
    resourceID: resourceID,
  };

  console.log(initialData);

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
        <h1 className="text-5xl font-bold">Edit Your Resource</h1>
        <UploadResourceForm userID={userID} initialData={initialData} />
      </main>
    </div>
  );
}
