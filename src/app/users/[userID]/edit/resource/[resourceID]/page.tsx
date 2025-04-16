import UploadResourceForm from "@/app/users/[userID]/_components/upload-resource-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { getClerkUserData } from "@/app/_actions/clerk";
import { neon } from "@neondatabase/serverless";

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

  const resourceFilesForResource = await sql`
    SELECT * FROM ResourceFile
    WHERE resourceid = ${resourceID};
  `;

  const resourceFileurls: string[] = resourceFilesForResource.map(
    (resFile) => resFile["url"],
  );

  console.log(resourceFileurls);

  const initialData = {
    ...resourceToEdit,
    resourceFiles: resourceFileurls,
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
