import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  id?: string;
  className?: string;
  wide?: boolean;
}

export function SectionContainer({
  children,
  id,
  className = "",
  wide = false,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={`relative w-full px-6 md:px-8 py-20 md:py-28 ${className}`}
    >
      <div
        className={`mx-auto ${wide ? "max-w-[1300px]" : "max-w-[1150px]"}`}
      >
        {children}
      </div>
    </section>
  );
}
