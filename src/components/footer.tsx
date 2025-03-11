import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
    return <footer className="w-full min-h-[256px] bg-secondary">
        <div className="px-[128px] py-10">
            <div className="space-y-10">
                <h3 className="text-5xl">IIITD Resource Hub</h3>
                <div className="flex flex-col justify-start gap-2">
                    <Link className="hover:underline" href="/">Home</Link>
                    <Link className="hover:underline" href="/resources">Resoruces</Link>
                    <Link className="hover:underline" href="/blogs">Blogs</Link>
                    <Link className="hover:underline" href="/questions">Q&amp;A</Link>
                </div>
            </div>
        </div>
    </footer>
}