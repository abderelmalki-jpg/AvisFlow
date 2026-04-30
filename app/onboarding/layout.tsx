import OnboardingWrapper from "./OnboardingWrapper";
export const dynamic = 'force-dynamic';


export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingWrapper>{children}</OnboardingWrapper>;
}
