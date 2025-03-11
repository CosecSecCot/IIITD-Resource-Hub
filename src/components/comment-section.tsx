import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function CommentSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Comments</h2>
            <div className="space-y-4">
                <Textarea placeholder="Add a Comment..." />
                <Button type="submit" >Submit</Button>
            </div>
            <div className="space-y-6">
                <Comment />
                <Comment />
                <Comment />
                <Comment />
            </div>
        </div>
    )
}

function Comment() {
    return <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border">
            <AvatarImage src="" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
                <div className="font-bold">Olivia Davis</div>
                <div className="text-xs text-muted-foreground">2 days ago</div>
            </div>
            <div className="text-sm">
                This is a great product! I've been using it for a week and it's been a game-changer.
            </div>
        </div>
    </div>
}