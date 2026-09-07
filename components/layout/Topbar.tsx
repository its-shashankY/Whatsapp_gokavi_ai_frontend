"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Icon } from "@/components/ui/Icon";

interface TopbarProps {
  title?: string;
  searchPlaceholder?: string;
}

export function Topbar({ title = "Gokavi Admin", searchPlaceholder }: TopbarProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-surface-bright/80 backdrop-blur-md sticky top-0 right-0 w-full z-30 flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">{title}</h1>
      </div>
      {searchPlaceholder && (
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant !text-[20px]"
            />
            <input
              className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-body-md text-on-surface focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none"
              placeholder={searchPlaceholder}
              type="text"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-full hover:bg-surface-container-lowest">
          <Icon name="notifications" />
        </button>
        <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-full hover:bg-surface-container-lowest">
          <Icon name="emergency_home" />
        </button>
        <button
          onClick={() => {
            signOut();
            router.push("/login");
          }}
          className="p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-full hover:bg-surface-container-lowest"
          title="Sign out"
        >
          <Icon name="account_circle" />
        </button>
      </div>
    </header>
  );
}
