import type { Metadata } from "next";

// Ce layout gère les metadata pour TOUTES les pages (auth)/
// login et register n'ont plus besoin de leur propre metadata

export function generateMetadata({ children }: { children: React.ReactNode }): {
  metadata?: Metadata;
} {
  return {};
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
