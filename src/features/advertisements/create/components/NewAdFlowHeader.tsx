import { useNavigate } from "react-router";
import { Header } from "./NewAdControls";
import type { FlowStep } from "../types";

interface NewAdFlowHeaderProps {
  goToDetails: () => void;
  handleEditBack: () => void;
  isCrmEditMode: boolean;
  isEditMode: boolean;
  leaveCrmEditor: () => void;
  step: FlowStep;
}

export function NewAdFlowHeader({
  goToDetails,
  handleEditBack,
  isCrmEditMode,
  isEditMode,
  leaveCrmEditor,
  step,
}: NewAdFlowHeaderProps) {
  const navigate = useNavigate();

  if (step === "agencySelection" || step === "publisherSelection") {
    return null;
  }

  const headerTitle =
    step === "moreFeatures"
      ? "مشخصات بیشتر"
      : step === "projectDetails"
        ? "جزئیات پروژه"
        : isEditMode
        ? "ویرایش آگهی"
        : "ثبت آگهی";

  const onBack =
    step === "moreFeatures" || step === "projectDetails"
      ? goToDetails
      : isCrmEditMode
        ? leaveCrmEditor
        : isEditMode
          ? handleEditBack
          : step === "details"
            ? () => navigate(`/new-ad/category${window.location.search}`)
            : undefined;

  return <Header title={headerTitle} onBack={onBack} />;
}
