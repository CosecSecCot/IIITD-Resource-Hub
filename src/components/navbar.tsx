"use client";
import React from "react";
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
import { MenuIcon } from "lucide-react";

export function Navbar({ children }: { children: React.ReactNode }) {
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
      <div className="w-full flex justify-end">
        <Button>LogIn</Button>
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
