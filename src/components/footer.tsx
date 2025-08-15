'use client'
import FooterNavLinks from "@/components/FooterNavLinks";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";

export function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="w-full py-16 px-4 bg-background border-t">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-3">
            <img
              src={resolvedTheme === "dark" ? "/dark_logo.svg" : "/light_logo.svg"}
              alt="Aesthetic AI Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <span className="font-bold text-xl text-foreground">
                Aesthetic AI
              </span>
              <p className="text-sm text-muted-foreground">
                Create amazing art with AI
              </p>
            </div>
          </div>
          <FooterNavLinks />
        </div>

        <Separator className="mb-8" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Aesthetic AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
