import type { ConsultantAd } from "../adManagementData";
import type { AgencyAdvertiseAssignmentDto } from "../../../advertisements/api/agency-advertise-assignment.service";

export type PublisherType = "agency" | "consultant";

export type SelectableConsultant = {
  avatarSrc?: string;
  id: string;
  name: string;
};

export const publisherOptions: {
  description: string;
  icon: "agency" | "consultant";
  label: string;
  value: PublisherType;
}[] = [
  {
    description:
      "آگهی به نام آژانس منتشر شده و مسئولیت و پیگیری آن مستقیماً بر عهده آژانس خواهد بود.",
    icon: "agency",
    label: "مدیریت مستقیم توسط آژانس",
    value: "agency",
  },
  {
    description:
      "آگهی به نام آژانس منتشر می‌شود ولی مسئولیت و پیگیری آن به مشاور منتخب تخصیص داده می‌شود.",
    icon: "consultant",
    label: "تخصیص به مشاور مسئول",
    value: "consultant",
  },
];

export type IndependentConsultantAdAllocationReviewPageProps = {
  ad?: ConsultantAd;
  assignment?: AgencyAdvertiseAssignmentDto;
  initialAssignedConsultant?: SelectableConsultant | null;
  initialConsultantPickerOpen?: boolean;
  initialPublisherType?: PublisherType;
  mockConsultants?: SelectableConsultant[];
};
