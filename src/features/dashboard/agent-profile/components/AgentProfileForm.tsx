import type { AgentProfileFormProps } from "../types";
import { AgentProfileDesktopForm } from "./AgentProfileDesktopForm";
import { AgentProfileMobileForm } from "./AgentProfileMobileForm";

export function AgentProfileForm(props: AgentProfileFormProps) {
  if (props.desktop) {
    return <AgentProfileDesktopForm {...props} />;
  }

  return <AgentProfileMobileForm {...props} />;
}
