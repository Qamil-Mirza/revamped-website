import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Radio, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CONTACT } from "../content-data";

/** Contact content for the space "Contact" beacon panel. */
export default function ContactContent() {
  return (
    <Card className="dark:bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Radio className="mr-2 h-5 w-5" /> Open Comms
        </CardTitle>
        <CardDescription className="text-primaryText">
          The fastest way to reach me, wherever you are in the galaxy
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <a
          href={`mailto:${CONTACT.email}`}
          className="group flex items-center gap-3 rounded-lg border border-gray-700 p-4 transition-colors hover:border-primary/60 hover:bg-white/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-primaryText group-hover:text-white">
              Email me
            </p>
            <p className="text-sm text-muted-foreground">{CONTACT.email}</p>
          </div>
        </a>

        <div className="grid grid-cols-3 gap-3">
          {CONTACT.socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-700 p-4 text-primaryText transition-colors hover:border-primary/60 hover:bg-white/5 hover:text-white"
            >
              <Icon size={26} />
              <span className="text-xs font-medium">{label}</span>
            </a>
          ))}
        </div>

        <Link
          href="/contact"
          className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Send me a message
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
