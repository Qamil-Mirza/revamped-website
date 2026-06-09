import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import Image from "next/image";
import qamil from "@/public/qm.jpg";
import { BIO } from "../content-data";

/** Bio section content, shared by the space "Who I Am" panel and LegacyAbout. */
export default function BioContent() {
  return (
    <Card className="dark:bg-gray-800 border-gray-700 overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[260px] md:min-h-[400px]">
          <Image
            src={qamil.src || "/placeholder.svg"}
            alt="Profile picture"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-bottom"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <User className="mr-1 h-3 w-3" /> About Me
            </div>
            <h2 className="text-2xl font-bold">{BIO.tagline}</h2>
            <div className="space-y-4">
              {BIO.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-primaryText">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
