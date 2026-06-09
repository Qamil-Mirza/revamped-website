import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code } from "lucide-react";
import { TECH_GROUPS } from "../content-data";

/** Tech stack content, shared by the space panel and LegacyAbout. */
export default function TechContent() {
  return (
    <Card className="dark:bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="mr-2 h-5 w-5" /> Tech Stack
        </CardTitle>
        <CardDescription className="text-primaryText">
          Technologies I work with
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {TECH_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-lg font-semibold">{group.title}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {group.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex items-center rounded-lg border border-gray-700 p-3"
                  >
                    <div
                      className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${
                        tool.faded ? "bg-primaryText/10" : "bg-primaryText"
                      }`}
                    >
                      <tool.Icon size={tool.size ?? 30} color={tool.color} />
                    </div>
                    <div>
                      <p className="font-medium">{tool.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
