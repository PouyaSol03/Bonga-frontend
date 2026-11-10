import LinearAiContent from "../../../../shared/icons/LinearAiContent";
import { Button } from "../../../../shared/ui/Button";
import { Section } from "./AgencyProfileFields";

export function AboutSection({
  aboutUs,
  onAboutUsChange,
}: {
  aboutUs: string;
  onAboutUsChange: (value: string) => void;
}) {
  return (
    <Section title="درباره ما">
      <Button
        unstyled
        className="bg-surface-container-high text-on-surface mt-3 mr-auto inline-flex cursor-not-allowed items-center gap-2 rounded-lg px-4 py-1.5 text-xs! leading-5 font-medium! opacity-50"
        type="button"
        disabled
      >
        <LinearAiContent className="text-on-surface-var h-4 w-4" />
        تولید با هوش مصنوعی
      </Button>
      <textarea
        className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/10 mt-3 h-24 w-full resize-none rounded-xl border px-3 py-3 text-right text-sm leading-5 font-normal outline-none focus:ring-2"
        onChange={(event) => onAboutUsChange(event.target.value)}
        placeholder="یک توضیح درباره آژانس خود بنویس"
        value={aboutUs}
      />
    </Section>
  );
}
