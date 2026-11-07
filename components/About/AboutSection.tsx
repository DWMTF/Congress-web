import NeuroscienceExplainer from "./NeuroscienceExplainer";
import CongressStages from "./CongressStages";
import type { HomePageData, NeuroscienceFactData, StageData } from "@/sanity/lib/queries";

interface AboutSectionProps {
  facts?: NeuroscienceFactData[] | null;
  stages?: StageData[] | null;
  pageData?: HomePageData | null;
}

export default function AboutSection({ facts, stages, pageData }: AboutSectionProps) {
  const hasFacts = Boolean(facts && facts.length > 0);
  const hasStages = Boolean(stages && stages.length > 0);

  if (!hasFacts && !hasStages) {
    return null;
  }

  return (
    <>
      {hasFacts && (
        <NeuroscienceExplainer
          facts={facts}
          heading={{
            eyebrow: pageData?.neuroscienceEyebrow,
            title: pageData?.neuroscienceTitle,
            subtitle: pageData?.neuroscienceSubtitle,
          }}
        />
      )}
      {hasStages && (
        <CongressStages
          stages={stages}
          heading={{
            eyebrow: pageData?.stagesEyebrow,
            title: pageData?.stagesTitle,
          }}
        />
      )}
    </>
  );
}
