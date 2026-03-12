"use client";
import { cn } from "@/lib/utils";
import { LogOut, Menu, Package, ShoppingCart, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/auth";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface SidebarMobileProps {
  userName: string;
}
const menuItems = [
  {
    title: "Orders",
    href: "/dashboard",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Tags,
  },
];
export function MobileSidebar() {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-50 border-b border-app-border bg-app-card">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 p-0 bg-app-sidebar border-app-border text-white **:data-radix-sheet-close:text-white"
            >
              <SheetHeader className="border-b border-app-border p-6">
                <SheetTitle className="text-xl text-white font-bold">
                  Menu
                </SheetTitle>
              </SheetHeader>
              {/* Menu */}
              <nav className="flex flex-col p-4 space-y-4">
                {menuItems.map((menu) => {
                  const Icon = menu.icon;
                  const isCurrent = pathName === menu.href;
                  return (
                    <Link
                      href={menu.href}
                      key={menu.title}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm text-white rounded-md font-medium transition-colors duration-300",
                        isCurrent
                          ? "bg-brand-primary text-white"
                          : "hover:bg-app-card",
                      )}
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      {menu.title}
                    </Link>
                  );
                })}
              </nav>
              {/* Footer */}
              <div className="absolute bottom-0 border-t border-app-border p-4 w-full">
                <form action={logoutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:text-red-700 hover:bg-transparent transition-colors duration-100"
                  >
                    <LogOut className="w-5 h-5" />
                    Log out
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
          <h1>
            <span className="hidden">The Cowshed Restaurant</span>
            <img
              src="/logo.png"
              alt="Logo"
              className="rounded-full w-14 mx-auto"
            />
          </h1>
          <div className="w-10"></div>
        </div>
      </header>
    </div>
  );
}
