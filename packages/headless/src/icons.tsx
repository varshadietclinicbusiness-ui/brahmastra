/**
 * The handful of glyphs components need internally (check, chevrons, close…).
 * Paths are from Lucide (ISC licence), so they match the Figma icon set exactly.
 * Components accept any ReactNode for user icons; these are only defaults.
 */
import type { SVGProps } from "react";

function Svg({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-slot="icon"
      {...props}
    >
      {children}
    </svg>
  );
}

export const CheckIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>;
export const MinusIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><path d="M5 12h14" /></Svg>;
export const PlusIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><path d="M5 12h14" /><path d="M12 5v14" /></Svg>;
export const XIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Svg>;
export const ChevronDownIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>;
export const ChevronRightIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><path d="m9 18 6-6-6-6" /></Svg>;
export const ArrowUpRightIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></Svg>;
export const SearchIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Svg>;
export const InfoIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></Svg>;
export const CircleCheckIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></Svg>;
export const CircleAlertIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></Svg>;
export const TriangleAlertIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></Svg>
);
export const UserIcon = (p: SVGProps<SVGSVGElement>) => <Svg {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Svg>;
export const StarIcon = (p: SVGProps<SVGSVGElement>) => (
  <Svg {...p}><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></Svg>
);
