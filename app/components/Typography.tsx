import type { ElementType, ReactNode } from "react";

// Site typography components. The actual fonts come from the design tokens in
// globals.css (--font-display for headings, --font-text for body), so swapping
// a font there updates these — and the whole site — in one place.
//
//   <Heading as="h1" className="text-3xl">Title</Heading>
//   <Text className="text-sm">Some copy</Text>

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Heading({ as: Tag = "h2", className = "", children }: Props) {
  return (
    <Tag className={`font-display font-bold tracking-tight text-zinc-900 ${className}`}>
      {children}
    </Tag>
  );
}

export function Text({ as: Tag = "p", className = "", children }: Props) {
  return <Tag className={`font-text text-zinc-600 ${className}`}>{children}</Tag>;
}
