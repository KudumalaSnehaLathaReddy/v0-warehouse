import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warehouse Inbound Management',
  description: 'Track and manage stock-in operations across warehouse locations',
};

export default function InboundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
