"use client";
import { cn } from "@/lib/utils";
import { LogOut, Package, ShoppingCart, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/auth";

interface SidebarProps {
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

export function Sidebar({ userName }: SidebarProps) {
  const pathName = usePathname();
  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-app-border bg-app-sidebar">
      {/* Header */}
      <div className="border-b border-app-border p-6">
        <h2>
          <img
            src="/logo.png"
            alt="Logo"
            className="rounded-full w-20 mx-auto"
          />
        </h2>
        <p className="text-sm text-gray-300 mt-1 w-full text-center">
          Hello, <span className="font-semibold">{userName}</span>
        </p>
      </div>
      {/* Menu */}
      <nav className="flex-1 p-4 space-y-4">
        {menuItems.map((menu) => {
          const Icon = menu.icon;
          const isCurrent = pathName === menu.href;
          return (
            <Link
              href={menu.href}
              key={menu.title}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300",
                isCurrent ? "bg-brand-primary text-white" : "hover:bg-app-card",
              )}
            >
              <Icon className="w-5 h-5" />
              {menu.title}
            </Link>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="border-t border-app-border p-4">
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
    </aside>
  );
}
