import { Menu, X } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
    >
      {isOpen ? (
        <X className="w-5 h-5 text-foreground" />
      ) : (
        <Menu className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
}
