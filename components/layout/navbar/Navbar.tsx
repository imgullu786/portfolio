"use client";

import { useState } from "react";
import { useLockBodyScroll } from "./hooks";
import { NavbarWrapper } from "./internal/NavbarWrapper";
import { DesktopNav } from "./internal/DesktopNav";
import { MobileNav } from "./internal/MobileNav";
import { MobileDrawer } from "./internal/MobileDrawer";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when drawer is open
  useLockBodyScroll(isOpen);

  return (
    <>
      <NavbarWrapper>
        <MobileNav isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
        <DesktopNav />
      </NavbarWrapper>
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
