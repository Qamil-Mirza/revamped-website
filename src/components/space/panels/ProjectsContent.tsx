import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlaskConical, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PROJECT_HIGHLIGHTS } from "../content-data";

/** Curated projects & research highlights for the space "Projects" panel. */
export default function ProjectsContent() {
  return (
    <Card className="dark:bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FlaskConical className="mr-2 h-5 w-5" /> Projects & Research
        </CardTitle>
        <CardDescription className="text-primaryText">
          Things I&apos;ve built across ML research, computational biology, and full-stack
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {PROJECT_HIGHLIGHTS.map((project) => (
          <a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-gray-700 p-4 transition-colors hover:border-primary/60 hover:bg-white/5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-primaryText group-hover:text-white">
                {project.title}
              </h3>
              <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-primaryText/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="dark:border-gray-600 dark:text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </a>
        ))}
        <Link
          href="/projects"
          className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Explore all projects
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
