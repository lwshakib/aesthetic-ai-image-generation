"use client";
import { ModeToggle } from "@/components/mode-toggle";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function MainNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "My Favorites",
      link: "/my-favorites",
    },
    {
      name: "My Creations",
      link: "/my-creations",
    },
    {
      name: "Plans",
      link: "/plans",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Find the active index based on current pathname
  // Handle both root routes and subdomain routes
  const activeIndex = navItems.findIndex(
    (item) => pathname === item.link || pathname.endsWith(item.link)
  );

  const handleSmoothScroll = (e: any) => {
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      const id = href.slice(1);
      const el = document.getElementById(id) || document.querySelector(href);
      if (el) {
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.pageYOffset - 200;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems
          items={navItems}
          onItemClick={handleSmoothScroll as any}
          activeIndex={activeIndex}
        />
        <div className="flex items-center gap-4">
          <div className="z-40">
            <ModeToggle />
          </div>
          <div className="z-40 flex justify-center items-center">
            <UserButton />
          </div>
          <NavbarButton
            onClick={() => router.push("/generate")}
            variant="primary"
          >
            Generate
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "relative px-4 py-2 rounded-full text-neutral-600 dark:text-neutral-300 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800",
                activeIndex === idx &&
                  "text-black dark:text-white font-semibold bg-gray-100 dark:bg-neutral-800"
              )}
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-row gap-4 items-center">
            <div className="z-40">
              <ModeToggle />
            </div>
            <div className="z-40">
              <UserButton />
            </div>
            <NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/generate");
              }}
              variant="primary"
              className="w-full"
            >
              Generate
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
