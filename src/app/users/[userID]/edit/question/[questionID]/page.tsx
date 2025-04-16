import { notFound } from "next/navigation";
import { QuestionForm } from "@/app/users/[userID]/_components/ask-question-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { neon } from "@neondatabase/serverless";
import { getClerkUserData } from "@/app/_actions/clerk";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ userID: string; questionID: string }>;
}) {
  const resolvedParams = await params;
  const userID = parseInt(resolvedParams.userID, 10);
  const questionID = parseInt(resolvedParams.questionID, 10);

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

  const questionToEditRes = await sql`
    SELECT * FROM Questions
    WHERE questionid = ${questionID} AND userid = ${userID};
  `;
  const quesToEdit = questionToEditRes[0];
  if (!quesToEdit) {
    notFound();
  }

  const initialData = {
    title: "",
    question: quesToEdit["content"],
    questionID: questionID,
  };

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
        <h1 className="text-5xl font-bold">Edit Your Question</h1>
        <QuestionForm userID={userID} initialData={initialData} />
      </main>
    </div>
  );
}
