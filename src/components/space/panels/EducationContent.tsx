import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { EDUCATION } from "../content-data";

/** Education section content, shared by the space panel and LegacyAbout. */
export default function EducationContent() {
  return (
    <Card className="dark:bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="mr-2 h-5 w-5" /> Education
        </CardTitle>
        <CardDescription className="text-primaryText">
          My academic background
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          {EDUCATION.map((entry) => (
            <Card key={entry.degree} className="dark:bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{entry.degree}</CardTitle>
                  <Badge>{entry.period}</Badge>
                </div>
                <CardDescription className="text-primaryText">
                  {entry.institution}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-primaryText">
                <p className="text-sm text-primaryText">{entry.detail}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="dark:border-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
