import {
  Calculator,
  Receipt,
  Money,
  IdentificationBadge,
  Package,
  Clock,
  Info,
  WarningCircle,
  CalendarCheck,
  BookOpenText,
  ListChecks,
  ShieldCheck,
  Check,
  Minus,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<{ size?: number; weight?: "regular"; "aria-hidden"?: boolean; className?: string }>> = {
  Calculator,
  Receipt,
  Money,
  IdentificationBadge,
  Package,
  Clock,
  Info,
  WarningCircle,
  CalendarCheck,
  BookOpenText,
  ListChecks,
  ShieldCheck,
  Check,
  Minus,
};

export function Icon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const C = MAP[name] ?? Info;
  return <C size={size} weight="regular" aria-hidden className={className} />;
}
