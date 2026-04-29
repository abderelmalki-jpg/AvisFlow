import OnboardingWrapper from "./OnboardingWrapper";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingWrapper>{children}</OnboardingWrapper>;
}
