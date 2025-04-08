import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import users from "@/data/users";
import { notFound } from "next/navigation";

export default function Page({
  params,
}: {
  params: { userID: string }; // userID from the URL
}) {
  const userID = parseInt(params.userID, 10);
  const user = users.find((user) => user.userID === userID);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-center">
        <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-6">
          <div className="flex gap-2 items-center">
            <Avatar className="w-[48px] h-[48px]">
              <AvatarImage src="" />
              <AvatarFallback>
                {user.email.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </div>
          <h1 className="text-5xl font-bold">Upload A Resource</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam placeat
            nobis saepe illo delectus vel cumque pariatur aspernatur laudantium
            facilis est minima reiciendis magni facere voluptatibus, suscipit
            nisi numquam explicabo?
          </p>
        </main>
      </div>
    </div>
  );
}
