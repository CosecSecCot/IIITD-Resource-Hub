import CommentSection from "@/components/comment-section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default async function Page({
    params,
}: {
    params: Promise<{ resourceID: string }>
}) {
    const { resourceID } = await params
    return <div>
        <main className="md:max-w-[765px] w-full mx-auto px-10 mt-10 mb-20 space-y-6">
            <div className="flex gap-2 items-center">
                <Avatar className="w-[48px] h-[48px]">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/126417139?v=4" />
                    <AvatarFallback>CSC</AvatarFallback>
                </Avatar>
                <span>{"CosecSecCot"}</span>
            </div>
            <h1 className="text-5xl font-bold">Resouce Name</h1>
            <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam placeat nobis saepe illo delectus vel cumque pariatur aspernatur laudantium facilis est minima reiciendis magni facere voluptatibus, suscipit nisi numquam explicabo?
            </p>
            <div className="flex gap-2 flex-wrap">
                <Badge>{"NOTES"}</Badge>
                {["Networks", "Computer Science", "Study"].map((tag, index) => {
                    return <Badge key={index} variant="secondary">{tag}</Badge>
                })}
            </div>
            <div className="w-full flex gap-6 flex-wrap">
                <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
                <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
                <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
            </div>
            <CommentSection />
        </main>
    </div>
}