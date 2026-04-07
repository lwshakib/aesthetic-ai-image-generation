import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", className)}
      fill="none"
      {...props}
    >
      <g transform="scale(0.9) translate(2.666,2.666)">
        <path
          d="M0 24C15.2548 24 24 15.2548 24 0C24 15.2548 32.7452 24 48 24C32.7452 24 24 32.7452 24 48C24 32.7452 15.2548 24 0 24Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
