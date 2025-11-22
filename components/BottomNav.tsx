"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, Car, Calendar, Trophy, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Search, label: "Search", path: "/" },
    { icon: Car, label: "Drive", path: "/map" },
    { icon: Calendar, label: "Trips", path: "/trips" },
    { icon: Trophy, label: "Rewards", path: "/rewards" },
    { icon: User, label: "Account", path: "/account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Icon
                className={`h-6 w-6 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
