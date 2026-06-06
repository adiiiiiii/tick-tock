"use client";

import { useState, useRef, useEffect, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

// ─── Context ────────────────────────────────────────────────────────────────

interface DropdownContextType {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType>({
  open: false,
  setOpen: () => {},
});

// ─── Root ────────────────────────────────────────────────────────────────────

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function DropdownMenuTrigger({
  children,
  className,
}: DropdownMenuTriggerProps) {
  const { open, setOpen } = useContext(DropdownContext);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-haspopup="true"
      aria-expanded={open}
      className={cn("cursor-pointer", className)}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(!open);
        }
      }}
    >
      {children}
    </div>
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
  className?: string;
}

export function DropdownMenuContent({
  children,
  align = "end",
  className,
}: DropdownMenuContentProps) {
  const { open } = useContext(DropdownContext);

  if (!open) return null;

  const alignClass = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }[align];

  return (
    <div
      role="menu"
      className={cn(
        "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        alignClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  disabled = false,
}: DropdownMenuItemProps) {
  const { setOpen } = useContext(DropdownContext);

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors",
        "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      onClick={() => {
        if (disabled) return;
        onClick?.();
        setOpen(false);
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
          setOpen(false);
        }
      }}
    >
      {children}
    </div>
  );
}

// ─── Separator ───────────────────────────────────────────────────────────────

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-gray-100", className)} />;
}

// ─── Label ───────────────────────────────────────────────────────────────────

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400",
        className,
      )}
    >
      {children}
    </div>
  );
}
