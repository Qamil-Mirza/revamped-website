import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  url: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-lg bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700 text-gray-100">
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2 border-b border-gray-700/50">
        <h3 className="text-xl font-bold tracking-tight text-white">
          {project.title}
        </h3>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <p className="text-gray-300 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <div className="w-full flex items-left justify-left">
          <InteractiveHoverButton>
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex items-center justify-center"
            >
              View Project
            </Link>
          </InteractiveHoverButton>
        </div>
      </CardFooter>
    </Card>
  );
}
