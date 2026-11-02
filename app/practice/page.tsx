import type { Metadata } from "next";
import PracticeContent from "@/content/pages/practice.mdx";
import { EditorialPage } from "@/components/site/editorial-page";

export const metadata: Metadata = {
  title: "Our practice",
  description:
    "How Dhidroid approaches engineering: understand the problem, make something real, and learn from what happens.",
};

export default function PracticePage() {
  return (
    <EditorialPage
      eyebrow="Our practice · How we work"
      title="A question is a good place to start."
      description="A small, thoughtful way of working: get close to the problem, make an idea tangible, and keep learning as you go."
      asideLabel="Working principle"
      asideText="Make useful progress. Keep the reasoning close. Leave a clear next step."
      asideHref="/work"
      asideLinkLabel="See what’s taking shape"
    >
      <PracticeContent />
    </EditorialPage>
  );
}
