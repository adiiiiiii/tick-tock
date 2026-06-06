"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Context to sync open/close state across components ---
const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context)
    throw new Error("Dialog components must be wrapped in <Dialog />");
  return context;
}

// --- Root Dialog Component ---
interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = ({
  children,
  open: controlledOpen,
  onOpenChange,
}: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      if (onOpenChange) onOpenChange(value);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

// --- Dialog Trigger ---
interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { setOpen } = useDialog();
    return (
      <button
        ref={ref}
        type="button"
        className={cn(className)}
        onClick={() => setOpen(true)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DialogTrigger.displayName = "DialogTrigger";

// --- Dialog Content (The Core Modal using Native HTML Dialog) ---
interface DialogContentProps extends React.HTMLAttributes<HTMLDialogElement> {}

const DialogContent = React.forwardRef<HTMLDialogElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useDialog();
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    // Combine forwarded ref and local ref
    React.useImperativeHandle(ref, () => dialogRef.current!);

    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open) {
        if (!dialog.open) {
          dialog.showModal();
          document.body.style.overflow = "hidden";
        }
      } else {
        if (dialog.open) {
          dialog.close();
        }
      }

      // ✅ cleanup always restores scroll when modal unmounts or closes
      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    // Handle Escape key and clicking backdrop to close
    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const handleCancel = (e: Event) => {
        e.preventDefault();
        setOpen(false);
      };

      const handleOutsideClick = (e: MouseEvent) => {
        // Native dialog backdrop fills the dialog element bounds.
        // If target is the dialog wrapper itself, it's a click on the backdrop.
        if (e.target === dialog) {
          setOpen(false);
        }
      };

      dialog.addEventListener("cancel", handleCancel);
      dialog.addEventListener("click", handleOutsideClick);
      return () => {
        dialog.removeEventListener("cancel", handleCancel);
        dialog.removeEventListener("click", handleOutsideClick);
      };
    }, [setOpen]);

    if (!open) return null;

    return (
      <dialog
        ref={dialogRef}
        className={cn(
          // Styles for the dialog panel and the pseudo::backdrop
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg backdrop:bg-black/80 outline-none m-0",
          className,
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </dialog>
    );
  },
);
DialogContent.displayName = "DialogContent";

// --- Structural Layout Components ---
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { setOpen } = useDialog();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(false)}
      className={cn(className)}
      {...props}
    />
  );
});
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
