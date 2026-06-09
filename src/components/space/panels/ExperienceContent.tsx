import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { EXPERIENCE } from "../content-data";

/** Experience timeline content, shared by the space panel and LegacyAbout. */
export default function ExperienceContent() {
  return (
    <Card className="dark:bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="mr-2 h-5 w-5" /> Work Experience
        </CardTitle>
        <CardDescription className="text-primaryText">
          My professional journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-primary/20 pl-6">
          {EXPERIENCE.map((job, i) => (
            <div
              key={`${job.org}-${job.period}`}
              className={i === EXPERIENCE.length - 1 ? "relative" : "mb-10 relative"}
            >
              <div className="absolute -left-[45px] -top-[5px] h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{job.title}</h3>
                <Badge className="mt-2 sm:mt-0 w-fit">{job.period}</Badge>
              </div>
              <p className="text-lg text-primaryText mb-2">{job.org}</p>
              <ul className="list-disc pl-5 text-primaryText mb-3 space-y-1">
                {job.points.map((point, j) => (
                  <li key={j}>{point}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="dark:border-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
