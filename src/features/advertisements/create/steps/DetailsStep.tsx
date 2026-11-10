import { useNavigate } from "react-router";
import { Footer, LocationBox, Section } from "../components/NewAdControls";
import { exchangeTargets, locationKey } from "../data";
import type { NewAdFieldErrorKey, NewAdFieldErrors } from "../types";
import { useNewAdDesktopLayout } from "../NewAdLayoutContext";
import { DailyHotelRoomsSection } from "./dailyHotel/DailyHotelRoomsSection";
import { DetailsPricing } from "./details/DetailsPricing";
import { DetailsProperties } from "./details/DetailsProperties";
import { DetailsAmenities } from "./details/DetailsAmenities";
import { DetailsOwner } from "./details/DetailsOwner";
import { DetailsSheet } from "./details/DetailsSheet";
import { getDetailsListingConfig } from "./details/listingConfig";
import { useDetailsForm } from "./details/useDetailsForm";

export function DetailsStep({
  errors = {},
  isPending = false,
  label,
  onClearError,
  onBack,
  onNext,
  onMoreFeatures,
  onProjectDetails,
}: {
  errors?: NewAdFieldErrors;
  isPending?: boolean;
  label?: string;
  onClearError?: (key: NewAdFieldErrorKey) => void;
  onBack?: () => void;
  onNext: () => void;
  onMoreFeatures?: () => void;
  onProjectDetails?: () => void;
}) {
  const navigate = useNavigate();
  const desktop = useNewAdDesktopLayout();
  const { values, sheet, setSheet, setField, handleLoanToggle, openSelectSheet } =
    useDetailsForm(onClearError);
  const {
    transaction,
    category,
    specsTitle,
    isProject,
    isPartnership,
    isRent,
    isDailyRent,
    isDailyHotelRent,
    hideHeatingCooling,
    showFacilitiesSection,
    allowLoan,
    allowExchange,
    allowRentConversion,
    locationTitle,
  } = getDetailsListingConfig(label);
  return (
    <>
      <main
        className={
          desktop
            ? "bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-5 [&>section]:mx-auto [&>section]:mb-5 [&>section]:max-w-[1120px]"
            : "bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-3"
        }
        dir="rtl"
      >
        <Section icon="location.svg" title={locationTitle}>
          <div data-field-key="location">
            <LocationBox
              label={label ?? ""}
              value={
                values.location ||
                (typeof window !== "undefined"
                  ? (window.localStorage.getItem(locationKey)?.trim() ?? "")
                  : "")
              }
            />
          </div>
        </Section>

        <DetailsProperties
          values={values}
          errors={errors}
          setField={setField}
          setSheet={setSheet}
          desktop={desktop}
          isProject={isProject}
          isDailyHotelRent={isDailyHotelRent}
          title={specsTitle}
          openSelectSheet={openSelectSheet}
          onProjectDetails={onProjectDetails}
          onMoreFeatures={onMoreFeatures}
        />
        {isDailyHotelRent ? (
          <Section icon="info.svg" title="مشخصات اتاق‌ها">
            <DailyHotelRoomsSection />
          </Section>
        ) : null}

        <DetailsAmenities
          transaction={transaction}
          category={category}
          values={values}
          errors={errors}
          setField={setField}
          setSheet={setSheet}
          hideHeatingCooling={hideHeatingCooling}
          showFacilitiesSection={showFacilitiesSection}
        />
        <DetailsOwner />
        <DetailsPricing
          values={values}
          errors={errors}
          setField={setField}
          desktop={desktop}
          isPartnership={isPartnership}
          isProject={isProject}
          isDailyRent={isDailyRent}
          isDailyHotelRent={isDailyHotelRent}
          isRent={isRent}
          allowLoan={allowLoan}
          allowExchange={allowExchange}
          allowRentConversion={allowRentConversion}
          onOpenExchange={() =>
            setSheet({ kind: "exchange", title: "معاوضه با", options: exchangeTargets })
          }
          handleLoanToggle={handleLoanToggle}
        />
      </main>

      <Footer
        disabled={isPending}
        onBack={onBack ?? (() => navigate(`/new-ad/category${window.location.search}`))}
        onPrimary={onNext}
        primary={isPending ? "در حال ذخیره..." : "مرحله بعد"}
      />

      <DetailsSheet sheet={sheet} setSheet={setSheet} values={values} setField={setField} />
    </>
  );
}
