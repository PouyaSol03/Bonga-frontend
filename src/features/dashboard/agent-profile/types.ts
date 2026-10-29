export type SelectedNeighborhood = {
  id: string;
  name: string;
};

export const profileImageMimeTypes = new Set(["image/jpeg", "image/png", "image/gif"]);
export const neighborhoodSearchDebounceMs = 250;

export interface AgentProfileFormProps {
  activityAreas: SelectedNeighborhood[];
  activityAreasError: string | null;
  avatarPreviewUrl: string | null;
  avatarUrl: string | null;
  desktop: boolean;
  email: string;
  instagram: string;
  isLoading: boolean;
  isSaving: boolean;
  name: string;
  nameError: string | null;
  onActivityAreaRemove: (id: string) => void;
  onAvatarChange: (file: File | null) => void;
  onEmailChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onOpenActivityAreaPicker: () => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
  onTelegramChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  phone: string;
  telegram: string;
  whatsapp: string;
}
