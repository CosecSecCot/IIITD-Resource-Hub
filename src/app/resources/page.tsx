"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const dynamic = "force-dynamic";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { extractGoogleDriveFileID } from "@/app/_actions/utils";

export default function Resources() {
  const [search, setSearch] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [resourceType, setResourceType] = useState("All");
  const [resources, setResources] = useState<ResourceCardProps[]>([]);
  const [isPending, startTransition] = useTransition();

  async function loadResources() {
    try {
      const res = await fetch(`/api/resources`);
      if (!res.ok) {
        console.error("Error fetching resources");
        return;
      }
      const data: ResourceCardProps[] = await res.json();
      setSubjects([...new Set(data.map((resource) => resource["subject"]))]);
      console.log(data);
      setResources(data);
    } catch (err) {
      console.error("Failed to load resources:", err);
    }
  }

  useEffect(() => {
    startTransition(() => {
      loadResources();
    });
  }, []);

  const filteredResources = useMemo(() => {
    console.log(year);
    return resources.filter(
      (resource) =>
        (resource.title.toLowerCase().includes(search.toLowerCase()) ||
          resource.description.toLowerCase().includes(search.toLowerCase())) &&
        (subject.trim() == "" || resource.subject === subject) &&
        (year.trim() == "" || resource.year === new Date(year).getFullYear()) &&
        (semester.trim() == "" ||
          resource.semester === parseInt(semester, 10)) &&
        (resourceType === "All" || resource.type === resourceType),
    );
  }, [resources, search, subject, year, semester, resourceType]);

  return (
    <div className="">
      <main className="md:w-[765px] px-10 mx-auto mt-20 mb-20">
        <h1 className="md:text-6xl text-5xl font-bold">Resources</h1>
        <p className="text-muted-foreground mt-4">
          Search any type of resource across the whole platform.
        </p>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 mt-20">
          <Input
            placeholder="Search Resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="w-full justify-between"
              >
                {subject.trim() ? subject : "Select Subject..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search Subject..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No Subject found.</CommandEmpty>
                  <CommandGroup>
                    {subjects.map((subj, idx) => (
                      <CommandItem
                        key={idx}
                        value={subj}
                        onSelect={(currentValue) => {
                          setSubject(
                            currentValue === subject ? "" : currentValue,
                          );
                          setComboboxOpen(false);
                        }}
                      >
                        {subj}
                        <Check
                          className={cn(
                            "ml-auto",
                            subject === subj ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Input
            type="date"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Semester..."
            min={1}
            max={8}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
          <Select
            defaultValue="All"
            value={resourceType}
            onValueChange={(value) => setResourceType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select resource type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Note">Note</SelectItem>
              <SelectItem value="PYQ">PYQ</SelectItem>
              <SelectItem value="Tutorial">Tutorial</SelectItem>
              <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-fit" type="submit">
            Search
          </Button>
        </div>
        <div className="mt-10 space-y-6">
          {isPending ? (
            <div>Loading...</div>
          ) : (
            filteredResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

type ResourceCardProps = {
  resourceid: number;
  title: string;
  description: string;
  type: "Note" | "PYQ" | "Tutorial" | "Assignment" | "Miscellaneous";
  uploaddate: string;
  subject: string;
  year: number;
  semester: number;
  urls: string[];
  useremail: string;
  username: string;
  userimgurl?: string;
};

function ResourceCard({
  resourceid,
  title,
  description,
  type,
  uploaddate,
  urls,
  subject,
  useremail,
  username,
  userimgurl,
}: ResourceCardProps) {
  return (
    <Card className="cursor-pointer">
      <Link href={`resources/${resourceid}`}>
        <CardContent>
          <div className="flex md:flex-row flex-col gap-6">
            <Image
              width={1}
              height={1}
              src={`https://drive.google.com/thumbnail?id=${extractGoogleDriveFileID(urls[0])}`}
              alt={title}
              className="md:min-w-[256px] min-h-[256px] bg-secondary rounded-lg"
            />
            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>
                  {new Date(uploaddate).toDateString()}
                </CardDescription>
                <CardDescription className="break-all line-clamp-3">
                  {description}
                </CardDescription>
                <div className="flex"></div>
                <div className="flex gap-2">
                  <Badge>{type}</Badge>
                  <Badge variant="secondary">{subject}</Badge>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Avatar className="w-[40px] h-[40px]">
                  <AvatarImage src={userimgurl} />
                  <AvatarFallback>
                    {useremail.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{username}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
