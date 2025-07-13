"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarProps, NavigationItem } from "@/app/types/index";
import { GraduationCap, Menu } from "lucide-react";
const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <GraduationCap className="h-5 w-5" />, // Add an icon here
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: <GraduationCap className="h-5 w-5" />, // Add an icon here
  },
  {
    title: "Add Teacher",
    href: "/add-teachers",
    icon: <GraduationCap className="h-5 w-5" />, // Add an icon here
  },
  {
    title: "Payments",
    href: "/payments",
    icon: <GraduationCap className="h-5 w-5" />, // Add an icon here
  },
];
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

const SidebarContent: React.FC<{
  pathname: string;
  onItemClick?: () => void;
}> = ({ pathname, onItemClick }) => (
  <div className="pb-12 w-full">
    <div className="space-y-4 py-4">
      {/* Logo */}
      <div className="px-3 py-2">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">
            ManagementSystem
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 py-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span> // Render the icon
                )}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// Desktop Sidebar
const DesktopSidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <div className={cn("hidden lg:block border-r bg-card/50 w-64", className)}>
      <SidebarContent pathname={pathname} />
    </div>
  );
};

// Mobile Sidebar
const MobileSidebar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="fixed top-4 left-4 z-50 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent
            pathname={pathname}
            onItemClick={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Combined Sidebar Component
const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;
