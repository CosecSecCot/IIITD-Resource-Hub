"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, User } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar({ children }: { children: React.ReactNode }) {
  const [dbUser, setDbUser] = useState<{ userid: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/currentDBUserID");
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setDbUser(data);
        } else {
          console.error("Failed to fetch DB user");
        }
      } catch (error) {
        console.error("Error fetching DB user:", error);
      }
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b dark:bg-background/60 bg-background/70 backdrop-blur px-4 md:px-6">
      <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {children}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav>
            <SheetHeader>
              <SheetTitle>IIITD Resource Hub</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 font-medium p-4">
              {React.Children.map(children, (child, index) => (
                <SheetClose asChild key={index}>
                  {child}
                </SheetClose>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="">
        <SignedOut>
          <Button asChild>
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                label="View Profile"
                labelIcon={<User />}
                href={`/users/${dbUser ? dbUser.userid : 1}`}
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>
      </div>
    </header>
  );
}

export function NavLink(
  props: Omit<React.ComponentProps<typeof Link>, "className">,
) {
  const pathName = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground",
        pathName.startsWith(props.href.toString()) ? "text-foreground" : "",
      )}
    />
  );
}
