"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollVisibility } from "../hooks";

interface NavbarWrapperProps {
  children: ReactNode;
}

export function NavbarWrapper({ children }: NavbarWrapperProps) {
  const isVisible = useScrollVisibility();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-transform duration-300",
        !isVisible && "-translate-y-full",
      )}
    >
      {children}
    </header>
  );
}
