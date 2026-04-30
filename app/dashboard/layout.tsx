import DashboardWrapper from "./DashboardWrapper";
export const dynamic = 'force-dynamic';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
