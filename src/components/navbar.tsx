"use client";
import React, { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CircleUser, Home, Menu, Package2, Search } from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar({ children }: { children: React.ReactNode }) {
    return (
        // <nav className="sticky top-0 z-50 bg-primary bg-opacity-20 backdrop-blur-sm text-primary flex justify-between items-center pr-4">
        //     <div className="bg-secondary text-primary flex justify-start">
        //         {children}
        //     </div>
        //     <span>
        //         <ModeToggle />
        //         <span className="sr-only">Theme Button</span>
        //     </span>
        // </nav>

        <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b dark:bg-background/60 bg-background/70 backdrop-blur px-4 md:px-6">
            <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                {children}
            </nav>
            <div className="w-full flex justify-end">
                <Button>LogIn</Button>
            </div>
        </header>
    );
}

export function NavLink(
    props: Omit<ComponentProps<typeof Link>, "className">
) {
    const pathName = usePathname();
    return (
        <Link
            {...props}
            // className={cn(
            //     "p-4 hover:bg-primary-foreground hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
            //     pathName === props.href ? "bg-background text-foreground" : ""
            // )}
            className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                pathName === props.href ? "text-foreground" : ""
            )}
        />
    );
}
