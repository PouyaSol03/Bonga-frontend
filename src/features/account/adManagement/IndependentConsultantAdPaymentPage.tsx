import { useEffect, useMemo, useState, type ReactNode } from "react";

import { getActiveV2Role, getApiErrorCode, getApiErrorMessage } from "../../../shared/api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import { useNavigate } from "react-router";
import { useToast } from "../../../shared/hooks/useToast";
import { useChargeWalletMutation, useWalletQuery } from "../api/account.hooks";
import {
  useAdvertisementCheckoutQuery,
  useAgencyAdvertisementCheckoutQuery,
  useConsultantAdvertisementCheckoutQuery,
  useSubmitAdvertisementCheckoutMutation,
  useSubmitAgencyAdvertisementCheckoutMutation,
  useSubmitConsultantAdvertisementCheckoutMutation,
} from "../../advertisements/api/advertisement.hooks";
import type {
  AdvertisementCheckout,
  AdvertisementCheckoutItem,
  AdvertisementCheckoutPaymentMethod,
  AdvertisementCheckoutPaymentMethodCode,
  AgencyAdvertisementCheckoutPaymentMethodCode,
  SubmitAdvertisementCheckoutResult,
} from "../../advertisements/api/advertisement.service";
import {
  validateDiscountCode,
  type ValidateDiscountCodeResult,
} from "../../crm/api/crm-discount.service";
import { PaymentOptionIcon } from "./AdManagementIcons";
import {
  formatTariffToman,
  formatAvailableInNotice,
  resolveAvailableIn,
  TariffNotice,
} from "./AdTariffOptionsView";
import { useAgentEntitlementsQuery } from "../../packages/api/package.hooks";
import { useAgencyConsultantsQuery } from "../../agencies/api/agency.hooks";
import LinearAdd from "../../../shared/icons/LinearAdd";
import LinearChartUp from "../../../shared/icons/LinearChartUp";
import LinearInfoCircle from "../../../shared/icons/LinearInfoCircle";
import LinearTooman from "../../../shared/icons/LinearTooman";
import LinearStairs from "../../../shared/icons/LinearStairs";
import LinearStartup from "../../../shared/icons/LinearStartup";
import LinearRefresh from "../../../shared/icons/LinearRefresh";
import {
  adManagementPaths,
  clearAgencyAllocationCheckout,
  clearNewAdCheckout,
  getAdManagementRouteState,
  getAdStatePath,
  hasAgencyAllocationCheckoutMarker,
  hasNewAdCheckoutMarker,
} from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from "../../../shared/constants/roles.constants";

export type PaymentMethod = "online" | "wallet";
type PaymentStep = "options" | "checkout";
type AgencyPaymentMethod =
  "ad_credit" | "by_consultant" | "free_quota" | "gateway" | "package_credit" | "wallet";

const checkoutItems = ["advertise_publish"];
const unavailableAfterPublishWarning = "این قابلیت پس از انتشار آگهی فعال می‌شود.";
const unavailableAfterPaidPublishWarning = "بعد از انتشار آگهی این امکان قابل استفاده خواهد بود";
const consultantUpgradeDisabledWarning =
  "امکانات ارتقای آگهی هنگام «ارسال به مشاور» قابل انتخاب نیست.";

const disabledUpgradeOptions = [
  {
    description: "آگهی شما به مدت ۳ روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.",
    id: "refresh",
    title: "بروزرسانی",
  },
  {
    description:
      "آگهی شما به مدت ۳ روز با برچسب ویژه، برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.",
    id: "special",
    title: "ویژه",
  },
  {
    description: "آگهی شما پیش از انقضا، برای یک ماه دیگر تمدید می‌شود.",
    id: "renew",
    title: "تمدید",
  },
  {
    description: "آگهی بروزرسانی و ویژه به صورت همزمان فعال می‌شود.",
    id: "refresh-special",
    title: "بروزرسانی و ویژه",
  },
] as const;

type UpgradeOptionId = (typeof disabledUpgradeOptions)[number]["id"];

const upgradeProductByOption: Record<UpgradeOptionId, string> = {
  refresh: "advertise_update",
  special: "advertise_special",
  renew: "advertise_extend",
  "refresh-special": "advertise_update_special",
};

function resolveUpgradeCheckoutItem(
  optionId: UpgradeOptionId,
  items: AdvertisementCheckoutItem[],
): AdvertisementCheckoutItem | undefined {
  return items.find((item) => item.product === upgradeProductByOption[optionId]);
}

function getUpgradeDescription(optionId: UpgradeOptionId, item?: AdvertisementCheckoutItem) {
  if (item?.description?.trim()) return item.description.trim();

  const days = Math.max(toSafeNumber(item?.duration_days), 0);
  const months = Math.max(toSafeNumber(item?.duration_months), 0);

  if (optionId === "refresh") {
    return days > 0
      ? `آگهی شما به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.`
      : "آگهی شما به مدت ۳ روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.";
  }
  if (optionId === "special") {
    return days > 0
      ? `آگهی شما به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز با برچسب ویژه، برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.`
      : "آگهی شما به مدت ۳ روز با برچسب ویژه، برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.";
  }
  if (optionId === "renew") {
    return months > 0
      ? `آگهی شما پیش از انقضا، برای ${new Intl.NumberFormat("fa-IR").format(months)} ماه دیگر تمدید می‌شود.`
      : "آگهی شما پیش از انقضا، برای یک ماه دیگر تمدید می‌شود.";
  }
  if (optionId === "refresh-special" && days > 0) {
    return `بروزرسانی و ویژه به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز همزمان فعال می‌شوند.`;
  }

  return disabledUpgradeOptions.find((option) => option.id === optionId)?.description ?? "";
}

function getUpgradeCheckoutItems(checkout: AdvertisementCheckout | undefined) {
  return (checkout?.items ?? []).filter(
    (item) => item.product !== "advertise_publish" && !/publish|ثبت|انتشار/i.test(item.product),
  );
}

function formatShortPayment(value: number) {
  if (value === 0) return "رایگان";
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted = new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: millions % 1 === 0 ? 0 : 2,
    }).format(millions);
    return `${formatted} میلیون تومان`;
  }
  if (value % 1000 === 0) {
    return `${new Intl.NumberFormat("fa-IR").format(value / 1000)} هزار تومان`;
  }

  return `${formatTariffToman(value)} تومان`;
}

function toSafeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));

    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

type CheckoutCreditType = "ad_credit" | "special_credit" | "renew_credit";

function aggregateCreditRequirements(items: AdvertisementCheckoutItem[]) {
  const result: Record<CheckoutCreditType, number> = {
    ad_credit: 0,
    special_credit: 0,
    renew_credit: 0,
  };

  items.forEach((item) => {
    (item.credit_requirements ?? []).forEach((requirement) => {
      const type = requirement.credit_type as CheckoutCreditType;
      if (!(type in result)) return;
      result[type] += Math.max(toSafeNumber(requirement.amount), 0);
    });
  });

  return result;
}

function getCreditBalances(method?: AdvertisementCheckoutPaymentMethod) {
  return {
    ad_credit: Math.max(
      toSafeNumber(method?.balances?.ad_credit, toSafeNumber(method?.balance)),
      0,
    ),
    special_credit: Math.max(toSafeNumber(method?.balances?.special_credit), 0),
    renew_credit: Math.max(toSafeNumber(method?.balances?.renew_credit), 0),
  };
}

function sumCreditValues(values: Record<CheckoutCreditType, number>) {
  return values.ad_credit + values.special_credit + values.renew_credit;
}

function readCheckoutAdvertiseId() {
  const match = window.location.pathname.match(
    /^\/(?:account\/)?ad-management\/payment\/([^/]+)\/?$/,
  );

  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function getCheckoutItem(checkout: AdvertisementCheckout, product: string) {
  return checkout.items.find((item) => item.product === product);
}

function getCheckoutMethod(checkout: AdvertisementCheckout, method: string) {
  return checkout.payment_methods.find((item) => item.method === method);
}

function getFreeQuotaRemaining(
  checkout: AdvertisementCheckout,
  publishItem: AdvertisementCheckoutItem | undefined,
) {
  const freeQuotaMethod = getCheckoutMethod(checkout, "free_quota");

  return Math.max(
    toSafeNumber(freeQuotaMethod?.remaining),
    toSafeNumber(publishItem?.free_quota?.remaining),
    0,
  );
}

export function IndependentConsultantAdPaymentPage() {
  const advertiseId = readCheckoutAdvertiseId();
  const fallbackBackTo = adManagementPaths.root;

  if (advertiseId) {
    return <AdvertisementCheckoutFlow advertiseId={advertiseId} />;
  }

  return (
    <CheckoutStatusPage
      backTo={fallbackBackTo}
      message="شناسه آگهی برای دریافت تعرفه از سرور موجود نیست."
      title="هزینه ثبت آگهی"
    />
  );
}

function AdvertisementCheckoutFlow({ advertiseId }: { advertiseId: string }) {
  const navigate = useNavigate();
  const routeState = getAdManagementRouteState();
  const authSession = getStoredAuthSession();
  const activeRole = getActiveAuthRole(authSession);
  const activeV2Role = getActiveV2Role();
  const managerPermissions =
    authSession?.contextPermissions?.real_estate_consultant ?? authSession?.managerPermissions;
  const hasAdManagementPermission = Boolean(
    managerPermissions?.manage_advertises ?? managerPermissions?.ad_management,
  );
  const isAgencyConsultantWithAdManagement =
    (activeRole === REAL_ESTATE_CONSULTANT || activeV2Role === "agency-consultant") &&
    hasAdManagementPermission;

  const adsHomePath = adManagementPaths.root;
  const isBusinessRole =
    activeRole !== USER &&
    Boolean(
      activeRole === REAL_ESTATE_MANAGER ||
      activeRole === REAL_ESTATE_CONSULTANT ||
      activeRole === INDEPENDENT_CONSULTANT,
    );
  const isAgencyAllocationCheckout =
    routeState.paymentFlow === "agency-allocation" ||
    hasAgencyAllocationCheckoutMarker(advertiseId);
  const isNewAdCheckout =
    routeState.paymentFlow === "new-ad" || hasNewAdCheckoutMarker(advertiseId);

  const isAgencyCheckout =
    activeRole === REAL_ESTATE_MANAGER ||
    activeV2Role === "agency" ||
    isAgencyConsultantWithAdManagement ||
    routeState.publisherType === "agency" ||
    routeState.isAgencyPublisher === true ||
    isAgencyAllocationCheckout;

  const isConsultantCheckout =
    !isAgencyCheckout &&
    (activeRole === REAL_ESTATE_CONSULTANT ||
      routeState.publisherType === "agent" ||
      routeState.publisherType === "consultant");

  const isConsultantAssignedCheckout = isConsultantCheckout;
  const usesAgencyCheckoutOptions = isBusinessRole || isAgencyCheckout;
  const combineCheckoutSteps = isBusinessRole || isAgencyCheckout;
  const personalCheckoutQuery = useAdvertisementCheckoutQuery(
    advertiseId,
    !isAgencyCheckout && !isConsultantCheckout,
  );
  const agencyCheckoutQuery = useAgencyAdvertisementCheckoutQuery(advertiseId, isAgencyCheckout);
  const consultantCheckoutQuery = useConsultantAdvertisementCheckoutQuery(
    advertiseId,
    isConsultantCheckout,
  );
  const personalCheckoutMutation = useSubmitAdvertisementCheckoutMutation();
  const agencyCheckoutMutation = useSubmitAgencyAdvertisementCheckoutMutation();
  const consultantCheckoutMutation = useSubmitConsultantAdvertisementCheckoutMutation();
  const checkoutQuery = isAgencyCheckout
    ? agencyCheckoutQuery
    : isConsultantCheckout
      ? consultantCheckoutQuery
      : personalCheckoutQuery;
  const checkoutPending = isAgencyCheckout
    ? agencyCheckoutMutation.isPending
    : isConsultantCheckout
      ? consultantCheckoutMutation.isPending
      : personalCheckoutMutation.isPending;
  const [step, setStep] = useState<PaymentStep>(routeState.paymentStep ?? "options");
  const [selectedUpgradeProducts, setSelectedUpgradeProducts] = useState<string[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [agencyMethod, setAgencyMethod] = useState<AgencyPaymentMethod>("ad_credit");
  const { showToast } = useToast();
  const showError = (message: string) => showToast(message, "خطا", "error");
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<ValidateDiscountCodeResult | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const stateAdPath = getAdStatePath(advertiseId);

  const agentEntitlementsQuery = useAgentEntitlementsQuery({ enabled: isBusinessRole });
  const fetchedCreditBalances = useMemo(() => {
    const checkoutData = checkoutQuery.data;
    const checkoutMethod = checkoutData
      ? (getCheckoutMethod(checkoutData, isAgencyCheckout ? "ad_credit" : "package_credit") ??
        getCheckoutMethod(checkoutData, "ad_credit"))
      : undefined;
    const fallback = getCreditBalances(checkoutMethod);
    return {
      ad_credit: agentEntitlementsQuery.data?.adCreditBalance ?? fallback.ad_credit,
      special_credit: agentEntitlementsQuery.data?.specialCreditBalance ?? fallback.special_credit,
      renew_credit: agentEntitlementsQuery.data?.renewCreditBalance ?? fallback.renew_credit,
    };
  }, [agentEntitlementsQuery.data, checkoutQuery.data, isAgencyCheckout]);
  const publishState = useMemo(
    () => ({
      ad: routeState.ad,
      assignment: routeState.assignment,
      assignmentId: routeState.assignmentId,
      card: routeState.card ?? routeState.ad,
      consultantId: routeState.consultantId,
      publisherType: routeState.publisherType,
      returnTo: adsHomePath,
      showPaymentSuccess: true,
      status: isNewAdCheckout ? "pending" : "published",
      tab: "status" as const,
    }),
    [
      isNewAdCheckout,
      routeState.ad,
      routeState.assignment,
      routeState.assignmentId,
      routeState.card,
      routeState.consultantId,
      routeState.publisherType,
    ],
  );

  const checkout = checkoutQuery.data;
  const upgradeItems = getUpgradeCheckoutItems(checkout);
  const selectedUpgradeItems = upgradeItems.filter((item) =>
    selectedUpgradeProducts.includes(item.product),
  );
  const selectedUpgradePrice = selectedUpgradeItems.reduce(
    (total, item) => total + Math.max(toSafeNumber(item.price), 0),
    0,
  );
  const publishItem = checkout ? getCheckoutItem(checkout, "advertise_publish") : undefined;
  const freeQuotaRemaining = checkout ? getFreeQuotaRemaining(checkout, publishItem) : 0;
  const freeQuotaMethod = checkout ? getCheckoutMethod(checkout, "free_quota") : undefined;
  const hasFreeQuota = Boolean(
    freeQuotaRemaining > 0 &&
    freeQuotaMethod?.available !== false &&
    publishItem?.free_quota?.available !== false,
  );
  const walletQuery = useWalletQuery();
  const rawWalletMethod = checkout ? getCheckoutMethod(checkout, "wallet") : undefined;
  const userWalletBalance = toSafeNumber(walletQuery.data?.credit, 0);
  const walletMethod: AdvertisementCheckoutPaymentMethod | undefined = useMemo(() => {
    if (rawWalletMethod) {
      return {
        ...rawWalletMethod,
        available: true,
        balance:
          rawWalletMethod.balance !== undefined
            ? toSafeNumber(rawWalletMethod.balance)
            : userWalletBalance,
      };
    }
    if (!checkout) return undefined;
    return {
      available: true,
      balance: userWalletBalance,
      method: "wallet",
    };
  }, [checkout, rawWalletMethod, userWalletBalance]);
  const gatewayMethod = checkout ? getCheckoutMethod(checkout, "gateway") : undefined;
  const checkoutRecord = checkout as Record<string, unknown> | undefined;
  const contextRecord = checkoutRecord?.context as Record<string, unknown> | undefined;
  const targetConsultantId =
    routeState.consultantId ||
    (routeState.ad as Record<string, unknown> | undefined)?.consultant_id ||
    (routeState.ad as Record<string, unknown> | undefined)?.assigned_consultant_id ||
    (routeState.ad as Record<string, unknown> | undefined)?.assignedConsultantId ||
    (routeState.ad as Record<string, unknown> | undefined)?.publisher_agent_id ||
    checkoutRecord?.consultant_id ||
    checkoutRecord?.assigned_consultant_id ||
    checkoutRecord?.agent_id ||
    contextRecord?.consultant_id ||
    contextRecord?.assigned_consultant_id ||
    contextRecord?.agent_id ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("consultant_id") ||
        new URLSearchParams(window.location.search).get("consultantId")
      : null);

  const hasConsultantManagementPermission = Boolean(managerPermissions?.manage_consultants);
  const isAgencyConsultantWithFullPermissions =
    isAgencyConsultantWithAdManagement && hasConsultantManagementPermission;

  const consultantsQuery = useAgencyConsultantsQuery({
    enabled: isAgencyConsultantWithFullPermissions,
    page: 1,
    perPage: 100,
  });
  const currentUserId = authSession?.userId;
  const currentMobile = authSession?.mobile;
  const myConsultant = (consultantsQuery.data?.data ?? []).find(
    (c) =>
      (currentUserId &&
        (String(c.userId) === String(currentUserId) ||
          String(c.agentId) === String(currentUserId))) ||
      (currentMobile && c.mobile === currentMobile),
  );
  const myConsultantAgentId = myConsultant?.agentId ? String(myConsultant.agentId) : undefined;
  const myConsultantUserId = myConsultant?.userId ? String(myConsultant.userId) : undefined;

  const isOwnConsultant = Boolean(
    targetConsultantId &&
    ((myConsultantAgentId && String(targetConsultantId) === myConsultantAgentId) ||
      (myConsultantUserId && String(targetConsultantId) === myConsultantUserId) ||
      (currentUserId && String(targetConsultantId) === String(currentUserId))),
  );

  const hasChangedConsultant = Boolean(
    targetConsultantId &&
    !isOwnConsultant &&
    (routeState.consultantAssignmentSelected ||
      routeState.consultantChanged ||
      routeState.consultantId ||
      routeState.publisherType === "consultant" ||
      routeState.publisherType === "agent" ||
      Boolean(targetConsultantId)),
  );

  const onlyShowByConsultant = Boolean(
    isAgencyConsultantWithFullPermissions && hasChangedConsultant,
  );

  const canSendToConsultant =
    activeRole === REAL_ESTATE_MANAGER ||
    activeV2Role === "agency" ||
    isAgencyConsultantWithAdManagement;

  const showByConsultant = Boolean(
    (canSendToConsultant && Boolean(targetConsultantId)) || onlyShowByConsultant,
  );

  const rawByConsultantMethod = checkout
    ? (getCheckoutMethod(checkout, "by_consultant") ?? getCheckoutMethod(checkout, "consultant"))
    : undefined;
  const byConsultantMethod =
    rawByConsultantMethod ??
    (showByConsultant ? { method: "by_consultant", available: true } : undefined);

  const packageCreditMethod: AdvertisementCheckoutPaymentMethod | undefined = useMemo(() => {
    const fromCheckout = checkout
      ? (getCheckoutMethod(checkout, isAgencyCheckout ? "ad_credit" : "package_credit") ??
        getCheckoutMethod(checkout, "ad_credit"))
      : undefined;

    if (fromCheckout) {
      return {
        ...fromCheckout,
        balance: fetchedCreditBalances.ad_credit,
        remaining: fetchedCreditBalances.ad_credit,
        balances: {
          ...fromCheckout.balances,
          ad_credit: fetchedCreditBalances.ad_credit,
          renew_credit: fetchedCreditBalances.renew_credit,
          special_credit: fetchedCreditBalances.special_credit,
        },
      };
    }

    if (usesAgencyCheckoutOptions) {
      return {
        available: fetchedCreditBalances.ad_credit > 0,
        balance: fetchedCreditBalances.ad_credit,
        balances: fetchedCreditBalances,
        method: "ad_credit",
      };
    }

    return undefined;
  }, [checkout, isAgencyAllocationCheckout, usesAgencyCheckoutOptions, fetchedCreditBalances]);
  const publishPrice = toSafeNumber(
    publishItem?.price,
    toSafeNumber(checkout?.summary.total_price, toSafeNumber(gatewayMethod?.required)),
  );
  const totalWithUpgrades = (hasFreeQuota ? 0 : publishPrice) + selectedUpgradePrice;
  const payableAmount =
    selectedUpgradeProducts.length > 0
      ? totalWithUpgrades
      : toSafeNumber(
          checkout?.summary.payable_amount,
          toSafeNumber(gatewayMethod?.required, publishPrice),
        );
  const totalPrice =
    selectedUpgradeProducts.length > 0
      ? publishPrice + selectedUpgradePrice
      : toSafeNumber(checkout?.summary.total_price, publishPrice);
  const finalPayable = appliedDiscount ? appliedDiscount.final_price : payableAmount;
  const is100PercentDiscount = Boolean(
    appliedDiscount?.is_free ||
    appliedDiscount?.disable_gateway ||
    (appliedDiscount && finalPayable === 0),
  );
  const creditCost = Math.max(
    toSafeNumber(publishItem?.credit_cost, toSafeNumber(checkout?.summary.credit_cost)),
    0,
  );
  const packageCreditRemaining = Math.max(
    toSafeNumber(packageCreditMethod?.remaining, toSafeNumber(packageCreditMethod?.balance)),
    0,
  );
  const packageCreditRequired = Math.max(
    toSafeNumber(packageCreditMethod?.required, creditCost),
    creditCost,
  );
  const packageCreditShortage = Math.max(
    toSafeNumber(packageCreditMethod?.shortage, packageCreditRequired - packageCreditRemaining),
    0,
  );
  const packageCreditAvailable = Boolean(
    packageCreditMethod && packageCreditMethod.available !== false && packageCreditShortage <= 0,
  );
  const agencyCreditCost = packageCreditMethod ? packageCreditRequired : creditCost;
  const agencyCreditMethod: AgencyPaymentMethod | null = isAgencyAllocationCheckout
    ? "ad_credit"
    : usesAgencyCheckoutOptions
      ? "ad_credit"
      : packageCreditAvailable
        ? "package_credit"
        : hasFreeQuota
          ? "free_quota"
          : packageCreditMethod
            ? "package_credit"
            : null;
  const agencyCreditAvailable =
    agencyCreditMethod === "free_quota" ? hasFreeQuota : packageCreditAvailable;
  const agencyCreditRemaining =
    agencyCreditMethod === "free_quota" ? freeQuotaRemaining : packageCreditRemaining;
  const agencyCreditShortage = agencyCreditMethod === "free_quota" ? 0 : packageCreditShortage;

  useEffect(() => {
    if (getApiErrorCode(checkoutQuery.error) !== "AD_WAITING_FOR_AGENCY") return;

    navigate(stateAdPath, {
      replace: true,
      state: {
        returnTo: adsHomePath,
        status: "wait_for_agency",
        tab: "status",
      },
    });
  }, [checkoutQuery.error, stateAdPath]);

  useEffect(() => {
    if (!checkout) return;

    const timer = setTimeout(() => {
      const gatewayAvailable = gatewayMethod?.available !== false;
      const walletBalance = toSafeNumber(walletMethod?.balance);
      const walletRequired = toSafeNumber(walletMethod?.required, payableAmount);
      const walletShortage = Math.max(
        toSafeNumber(walletMethod?.shortage, walletRequired - walletBalance),
        0,
      );
      const walletAvailable = Boolean(walletMethod && walletShortage <= 0);
      const walletSelectable = Boolean(walletMethod);
      const creditSelectable = Boolean(
        agencyCreditMethod && (agencyCreditAvailable || agencyCreditShortage > 0),
      );

      if (usesAgencyCheckoutOptions) {
        if (onlyShowByConsultant) {
          if (agencyMethod !== "by_consultant") {
            setAgencyMethod("by_consultant");
          }
          return;
        }

        const byConsultantAvailable = showByConsultant && byConsultantMethod?.available !== false;
        const currentMethodSelectable =
          ((agencyMethod === "free_quota" ||
            agencyMethod === "package_credit" ||
            agencyMethod === "ad_credit") &&
            agencyMethod === agencyCreditMethod &&
            creditSelectable) ||
          (agencyMethod === "by_consultant" && byConsultantAvailable) ||
          (agencyMethod === "wallet" && walletSelectable) ||
          (agencyMethod === "gateway" && gatewayAvailable && Boolean(gatewayMethod));

        // Keep a user-selected insufficient-balance method selected. The radio remains
        // interactive and the submit button is what becomes disabled.
        if (currentMethodSelectable) return;

        if (byConsultantAvailable) {
          setAgencyMethod("by_consultant");
        } else if (agencyCreditMethod && agencyCreditAvailable) {
          setAgencyMethod(agencyCreditMethod);
        } else if (walletAvailable) {
          setAgencyMethod("wallet");
        } else if (gatewayAvailable && gatewayMethod) {
          setAgencyMethod("gateway");
        } else if (creditSelectable && agencyCreditMethod) {
          setAgencyMethod(agencyCreditMethod);
        } else if (walletSelectable) {
          setAgencyMethod("wallet");
        }

        return;
      }

      if (gatewayAvailable && walletShortage > 0) {
        setMethod("online");
      } else if (!gatewayAvailable && walletAvailable) {
        setMethod("wallet");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [
    agencyMethod,
    agencyCreditAvailable,
    agencyCreditMethod,
    agencyCreditShortage,
    byConsultantMethod,
    checkout,
    gatewayMethod,
    hasFreeQuota,
    onlyShowByConsultant,
    payableAmount,
    showByConsultant,
    usesAgencyCheckoutOptions,
    walletMethod,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (is100PercentDiscount && method === "online") {
        setMethod("wallet");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [is100PercentDiscount, method]);

  async function handleApplyDiscount() {
    const code = discountInput.trim();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError(null);
    try {
      const result = await validateDiscountCode({
        code,
        price: totalPrice || payableAmount,
        service: "advertise",
      });
      setAppliedDiscount(result);
      if (result.disable_gateway || result.is_free || result.final_price === 0) {
        setMethod("wallet");
      }
    } catch (err: unknown) {
      const msg = getApiErrorMessage(
        err,
        err instanceof Error && err.message ? err.message : "کد تخفیف نامعتبر است",
      );
      setDiscountError(msg);
      setAppliedDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  }

  function handleRemoveDiscount() {
    setAppliedDiscount(null);
    setDiscountInput("");
    setDiscountError(null);
  }

  function finishCheckout(
    paymentMethod:
      AdvertisementCheckoutPaymentMethodCode | AgencyAdvertisementCheckoutPaymentMethodCode,
    extraItems: string[] = [],
  ) {
    if (checkoutPending) return;

    const mutationOptions = {
      onError: (error: unknown) => {
        if (getApiErrorCode(error) === "AD_WAITING_FOR_AGENCY") {
          navigate(stateAdPath, {
            replace: true,
            state: {
              returnTo: adsHomePath,
              status: "wait_for_agency",
              tab: "status",
            },
          });
          return;
        }

        showError(getApiErrorMessage(error, "پرداخت و انتشار آگهی با خطا مواجه شد."));
      },
      onSuccess: ({ paymentUrl }: SubmitAdvertisementCheckoutResult) => {
        if (isAgencyAllocationCheckout) {
          clearAgencyAllocationCheckout(advertiseId);
        }
        if (isNewAdCheckout) {
          clearNewAdCheckout(advertiseId);
        }

        if (paymentMethod === "by_consultant") {
          navigate(adsHomePath, { replace: true, state: { tab: "status" } });
          return;
        }

        if (paymentMethod === "gateway") {
          if (!paymentUrl) {
            showError("آدرس درگاه پرداخت از سرور دریافت نشد.");
            return;
          }

          storePaymentReturnTarget({
            label: "بازگشت به وضعیت آگهی",
            path: stateAdPath,
          });
          window.location.assign(paymentUrl);
          return;
        }

        navigate(stateAdPath, { replace: true, state: publishState });
      },
    };

    if (isAgencyCheckout) {
      agencyCheckoutMutation.mutate(
        {
          advertiseId,
          consultantId:
            paymentMethod === "by_consultant"
              ? String(targetConsultantId || routeState.consultantId || "")
              : undefined,
          discount_code: appliedDiscount?.code,
          items: Array.from(new Set([...checkoutItems, ...extraItems])),
          paymentMethod: paymentMethod as AgencyAdvertisementCheckoutPaymentMethodCode,
        },
        mutationOptions,
      );
      return;
    }

    if (isConsultantCheckout) {
      consultantCheckoutMutation.mutate(
        {
          advertiseId,
          discount_code: appliedDiscount?.code,
          items: Array.from(new Set([...checkoutItems, ...extraItems])),
          paymentMethod: paymentMethod as AdvertisementCheckoutPaymentMethodCode,
        },
        mutationOptions,
      );
      return;
    }

    personalCheckoutMutation.mutate(
      {
        advertiseId,
        discount_code: appliedDiscount?.code,
        items: Array.from(new Set([...checkoutItems, ...extraItems])),
        paymentMethod: paymentMethod as AdvertisementCheckoutPaymentMethodCode,
      },
      mutationOptions,
    );
  }

  function handleCompleteOptions() {
    if (hasFreeQuota && selectedUpgradeProducts.length === 0) {
      finishCheckout("free_quota");
      return;
    }

    setStep("checkout");
  }

  const checkoutBackTo = isAgencyAllocationCheckout
    ? `/account/ad-management/allocation-review/${encodeURIComponent(advertiseId)}`
    : isConsultantAssignedCheckout
      ? "/account/ad-management/allocation"
      : isNewAdCheckout
        ? adsHomePath
        : "/new-ad";

  const leaveNewAdPayment = () => {
    navigate(adsHomePath, { replace: true, state: { tab: "status" } });
  };

  if (checkoutQuery.isLoading || (isBusinessRole && agentEntitlementsQuery.isLoading)) {
    return (
      <CheckoutStatusPage
        backTo={checkoutBackTo}
        isLoading
        message="در حال دریافت هزینه و روش‌های پرداخت آگهی..."
        title="هزینه ثبت آگهی"
      />
    );
  }

  if (checkoutQuery.isError || (isBusinessRole && agentEntitlementsQuery.isError) || !checkout) {
    return (
      <CheckoutStatusPage
        backTo={checkoutBackTo}
        message={getApiErrorMessage(
          checkoutQuery.error ?? agentEntitlementsQuery.error,
          "دریافت اطلاعات پرداخت و اعتبارها با خطا مواجه شد.",
        )}
        onRetry={() => {
          void checkoutQuery.refetch();
          if (isBusinessRole) void agentEntitlementsQuery.refetch();
        }}
        title="هزینه ثبت آگهی"
      />
    );
  }

  if (combineCheckoutSteps) {
    return (
      <AgencyCombinedCheckoutView
        byConsultantMethod={byConsultantMethod}
        creditCost={agencyCreditCost}
        creditAvailable={agencyCreditAvailable}
        creditBalances={fetchedCreditBalances}
        creditMethod={agencyCreditMethod}
        creditPaymentMethod={packageCreditMethod}
        creditRemaining={agencyCreditRemaining}
        creditShortage={agencyCreditShortage}
        gatewayMethod={gatewayMethod}
        method={agencyMethod}
        onBack={
          isNewAdCheckout ? leaveNewAdPayment : () => navigate(stateAdPath, { replace: true })
        }
        onMethodChange={setAgencyMethod}
        onSubmit={(extraItems) => finishCheckout(agencyMethod, extraItems)}
        payableAmount={payableAmount}
        pending={checkoutPending}
        price={publishPrice}
        showByConsultant={showByConsultant}
        onlyShowByConsultant={onlyShowByConsultant}
        title="پرداخت"
        upgradeItems={upgradeItems}
        walletMethod={walletMethod}
      ></AgencyCombinedCheckoutView>
    );
  }

  if (step === "checkout") {
    if (usesAgencyCheckoutOptions) {
      return (
        <AgencyCombinedCheckoutView
          byConsultantMethod={byConsultantMethod}
          creditCost={agencyCreditCost}
          creditAvailable={agencyCreditAvailable}
          creditBalances={fetchedCreditBalances}
          creditMethod={agencyCreditMethod}
          creditPaymentMethod={packageCreditMethod}
          creditRemaining={agencyCreditRemaining}
          creditShortage={agencyCreditShortage}
          gatewayMethod={gatewayMethod}
          method={agencyMethod}
          onBack={isNewAdCheckout ? leaveNewAdPayment : () => setStep("options")}
          onMethodChange={setAgencyMethod}
          onSubmit={(extraItems) => finishCheckout(agencyMethod, extraItems)}
          payableAmount={payableAmount}
          pending={checkoutPending}
          price={publishPrice}
          showByConsultant={showByConsultant}
          onlyShowByConsultant={onlyShowByConsultant}
          showPurchaseDetails={false}
          title="پرداخت"
          upgradeItems={upgradeItems}
          walletMethod={walletMethod}
        ></AgencyCombinedCheckoutView>
      );
    }

    return (
      <ApiPaymentCheckoutView
        appliedDiscount={appliedDiscount}
        discountError={discountError}
        discountInput={discountInput}
        discountLoading={discountLoading}
        gatewayMethod={gatewayMethod}
        method={method}
        onApplyDiscount={handleApplyDiscount}
        onBack={isNewAdCheckout ? leaveNewAdPayment : () => setStep("options")}
        onDiscountInputChange={(val) => {
          setDiscountInput(val);
          if (discountError) setDiscountError(null);
        }}
        onMethodChange={setMethod}
        onRemoveDiscount={handleRemoveDiscount}
        onSubmit={() =>
          finishCheckout(
            method === "wallet" ? "wallet" : "gateway",
            selectedUpgradeProducts,
          )
        }
        payableAmount={finalPayable}
        pending={checkoutPending}
        totalPrice={totalPrice}
        walletMethod={walletMethod}
      ></ApiPaymentCheckoutView>
    );
  }

  function toggleUpgrade(product: string) {
    setAppliedDiscount(null);
    setSelectedUpgradeProducts((current) => {
      const isSelected = current.includes(product);
      if (isSelected) return current.filter((item) => item !== product);

      if (product === "advertise_update_special") {
        return [
          ...current.filter((item) => item !== "advertise_update" && item !== "advertise_special"),
          product,
        ];
      }

      if (product === "advertise_update" || product === "advertise_special") {
        return [...current.filter((item) => item !== "advertise_update_special"), product];
      }

      return [...current, product];
    });
  }

  return (
    <CheckoutTariffView
      backTo={checkoutBackTo}
      freeQuotaRemaining={freeQuotaRemaining}
      hasFreeQuota={hasFreeQuota}
      onComplete={handleCompleteOptions}
      onToggleUpgrade={toggleUpgrade}
      pending={checkoutPending}
      price={publishPrice}
      selectedUpgradeProducts={selectedUpgradeProducts}
      upgradeItems={upgradeItems}
    ></CheckoutTariffView>
  );
}

function AgencyCombinedCheckoutView({
  byConsultantMethod,
  children,
  creditCost,
  creditAvailable,
  creditBalances: propCreditBalances,
  creditMethod,
  creditPaymentMethod,
  creditShortage,
  gatewayMethod,
  method,
  onBack,
  onMethodChange,
  onSubmit,
  payableAmount,
  pending,
  price,
  showByConsultant = false,
  onlyShowByConsultant = false,
  showPurchaseDetails = true,
  title = "پرداخت",
  upgradeItems = [],
  walletMethod,
}: {
  byConsultantMethod?: AdvertisementCheckoutPaymentMethod;
  children?: ReactNode;
  creditCost: number;
  creditAvailable: boolean;
  creditBalances?: { ad_credit: number; special_credit: number; renew_credit: number };
  creditMethod: AgencyPaymentMethod | null;
  creditPaymentMethod?: AdvertisementCheckoutPaymentMethod;
  creditRemaining: number;
  creditShortage: number;
  gatewayMethod?: AdvertisementCheckoutPaymentMethod;
  method: AgencyPaymentMethod;
  onBack?: () => void;
  onMethodChange: (method: AgencyPaymentMethod) => void;
  onSubmit: (extraItems?: string[]) => void;
  payableAmount: number;
  pending: boolean;
  price: number;
  showByConsultant?: boolean;
  onlyShowByConsultant?: boolean;
  showPurchaseDetails?: boolean;
  title?: string;
  upgradeItems?: AdvertisementCheckoutItem[];
  walletMethod?: AdvertisementCheckoutPaymentMethod;
}) {
  const [selectedUpgradeProducts, setSelectedUpgradeProducts] = useState<string[]>([]);
  const upgradeSelectionEnabled = method !== "by_consultant";
  const selectedUpgradeItems = upgradeItems.filter((item) =>
    selectedUpgradeProducts.includes(item.product),
  );
  const selectedPayableAmount =
    price +
    selectedUpgradeItems.reduce((total, item) => total + Math.max(toSafeNumber(item.price), 0), 0);

  const walletBalance = toSafeNumber(walletMethod?.balance);
  const walletRequired = selectedPayableAmount || payableAmount;
  const walletDeficit = Math.max(walletRequired - walletBalance, 0);
  const walletSupported = Boolean(walletMethod);
  const walletAvailable = Boolean(walletMethod && walletDeficit <= 0);
  const walletSelectable = Boolean(walletMethod);

  const selectedRequirements = aggregateCreditRequirements(selectedUpgradeItems);
  selectedRequirements.ad_credit += Math.max(creditCost, 0);
  const selectedCreditCost = sumCreditValues(selectedRequirements);
  const fallbackBalances = getCreditBalances(creditPaymentMethod);
  const creditBalances = {
    ad_credit: propCreditBalances?.ad_credit ?? fallbackBalances.ad_credit,
    special_credit: propCreditBalances?.special_credit ?? fallbackBalances.special_credit,
    renew_credit: propCreditBalances?.renew_credit ?? fallbackBalances.renew_credit,
  };
  const selectedShortage = {
    ad_credit: Math.max(selectedRequirements.ad_credit - creditBalances.ad_credit, 0),
    special_credit: Math.max(
      selectedRequirements.special_credit - creditBalances.special_credit,
      0,
    ),
    renew_credit: Math.max(selectedRequirements.renew_credit - creditBalances.renew_credit, 0),
  };
  const selectedCreditShortage =
    creditMethod === "ad_credit" ? sumCreditValues(selectedShortage) : creditShortage;
  const selectedCreditAvailable =
    creditMethod === "ad_credit"
      ? Boolean(creditPaymentMethod) && selectedCreditShortage === 0
      : creditAvailable;
  const creditSelectable = Boolean(
    creditMethod && (selectedCreditAvailable || selectedCreditShortage > 0),
  );

  const gatewayAvailable = gatewayMethod?.available !== false && Boolean(gatewayMethod);
  const byConsultantAvailable = showByConsultant && byConsultantMethod?.available !== false;
  const selectedMethodAvailable =
    method === "free_quota" || method === "package_credit" || method === "ad_credit"
      ? Boolean(creditMethod && method === creditMethod && selectedCreditAvailable)
      : method === "by_consultant"
        ? byConsultantAvailable
        : method === "wallet"
          ? walletAvailable && walletDeficit <= 0
          : gatewayAvailable;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (upgradeSelectionEnabled) return;
      setSelectedUpgradeProducts([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [upgradeSelectionEnabled]);

  function toggleUpgrade(product: string) {
    if (!upgradeSelectionEnabled) return;

    setSelectedUpgradeProducts((current) => {
      const isSelected = current.includes(product);
      if (isSelected) return current.filter((item) => item !== product);

      if (product === "advertise_update_special") {
        return [
          ...current.filter((item) => item !== "advertise_update" && item !== "advertise_special"),
          product,
        ];
      }

      if (product === "advertise_update" || product === "advertise_special") {
        return [...current.filter((item) => item !== "advertise_update_special"), product];
      }

      return [...current, product];
    });
  }

  const publishCostLabel =
    method === "ad_credit"
      ? `${new Intl.NumberFormat("fa-IR").format(Math.max(creditCost, 0))} اعتبار`
      : method === "free_quota" || method === "package_credit"
        ? creditCost > 0
          ? `${new Intl.NumberFormat("fa-IR").format(creditCost)} اعتبار`
          : creditAvailable
            ? "رایگان"
            : `${formatTariffToman(price)} تومان`
        : `${formatTariffToman(price)} تومان`;

  const submitLabel =
    method === "by_consultant"
      ? "ارسال به مشاور"
      : method === "free_quota" || method === "package_credit" || method === "ad_credit"
        ? selectedCreditCost > 0
          ? `انتشار آگهی - ${new Intl.NumberFormat("fa-IR").format(selectedCreditCost)} اعتبار`
          : "انتشار آگهی"
        : `پرداخت و انتشار - ${formatShortPayment(selectedPayableAmount)}`;

  const adCreditCount = creditBalances.ad_credit;
  const creditBalanceLabel = `مانده: ${new Intl.NumberFormat("fa-IR").format(adCreditCount)} اعتبار`;

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex h-full min-h-0 flex-1 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        className="bg-surface-container [&_button]:text-on-surface"
        onBack={onBack ?? (() => window.history.back())}
        title={title}
      />

      {children}

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-6">
        <section className="bg-surface-container-lowest" aria-label="هزینه ثبت آگهی و روش پرداخت">
          {showPurchaseDetails && !onlyShowByConsultant ? (
            <>
              <div className="px-4 pt-5 pb-4" aria-label="هزینه ثبت آگهی">
                <div className="flex items-start justify-between gap-5 [direction:ltr]">
                  <Typography
                    as="span"
                    variant="label"
                    size="medium"
                    weight="medium"
                    className="text-on-surface shrink-0 pt-1 text-sm leading-5 font-medium [direction:rtl]"
                  >
                    {publishCostLabel}
                  </Typography>

                  <Typography
                    as="span"
                    variant="label"
                    size="large"
                    weight="semibold"
                    className="flex min-w-0 flex-1 items-center justify-start gap-2 text-right text-base leading-6 font-semibold [direction:rtl]"
                  >
                    <ChoiceIndicator checked className="h-5 w-5 rounded-[4px]" disabled />
                    هزینه ثبت آگهی
                  </Typography>
                </div>

                <Typography
                  as="p"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="text-on-surface-var m-0 mt-3 text-right text-sm leading-6 font-normal"
                >
                  برای ثبت آگهی، باید هزینه انتشار را پرداخت کنید.
                </Typography>
              </div>

              <div className="border-outline-var/40 mx-4 border-t" />
            </>
          ) : null}

          <div className="pt-5 pb-2" aria-label="روش پرداخت">
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 mb-2 px-4 text-right text-base leading-6 font-semibold"
            >
              روش پرداخت
            </Typography>

            {showByConsultant ? (
              <>
                <PaymentMethodOption
                  active={method === "by_consultant"}
                  disabled={!byConsultantAvailable}
                  icon="consultant"
                  label="ارسال به مشاور"
                  onClick={() => onMethodChange("by_consultant")}
                  subLabel={
                    byConsultantAvailable
                      ? "ارسال آگهی برای انتشار توسط مشاور"
                      : "این روش در دسترس نیست"
                  }
                />
                {!onlyShowByConsultant ? (
                  <div className="border-outline-var/40 mx-4 border-t" />
                ) : null}
              </>
            ) : null}

            {!onlyShowByConsultant && creditMethod ? (
              <>
                <PaymentMethodOption
                  active={method === creditMethod}
                  disabled={!creditSelectable}
                  icon="credit"
                  label="اعتبار آگهی"
                  onClick={() => onMethodChange(creditMethod)}
                  subLabel={creditBalanceLabel}
                  subLabelClassName={
                    selectedCreditShortage > 0 || !selectedCreditAvailable
                      ? "text-error"
                      : "text-tertiary font-medium"
                  }
                />

                {selectedCreditShortage > 0 ? (
                  <div className="px-4 pb-2">
                    <ApiCreditDeficitBox deficit={selectedCreditShortage} />
                  </div>
                ) : null}

                <div className="border-outline-var/40 mx-4 border-t" />
              </>
            ) : null}

            {!onlyShowByConsultant ? (
              <>
                <PaymentMethodOption
                  active={method === "wallet"}
                  disabled={!walletSelectable}
                  icon="wallet"
                  label="کیف پول"
                  onClick={() => onMethodChange("wallet")}
                  subLabel={
                    walletSupported
                      ? `مانده: ${formatTariffToman(walletBalance)} تومان`
                      : "این روش پرداخت در دسترس نیست"
                  }
                  subLabelClassName={
                    walletDeficit > 0 ? "text-error font-medium" : "text-tertiary font-medium"
                  }
                />

                {walletSupported && walletDeficit > 0 ? (
                  <div className="px-4 pt-1 pb-2">
                    <ApiWalletDeficitBox deficit={walletDeficit} />
                  </div>
                ) : null}

                <div className="border-outline-var/40 mx-4 border-t" />

                <PaymentMethodOption
                  active={method === "gateway"}
                  disabled={!gatewayAvailable}
                  icon="online"
                  label="پرداخت آنلاین"
                  onClick={() => onMethodChange("gateway")}
                  subLabel={gatewayAvailable ? "بانک ملت" : "درگاه پرداخت در دسترس نیست"}
                />
              </>
            ) : null}
          </div>
        </section>

        {showPurchaseDetails && !onlyShowByConsultant ? (
          <>
            <div className="bg-surface-container h-2" aria-hidden="true" />
            <DisabledUpgradeOptionsSection
              creditBalances={creditBalances}
              disabledWarning={consultantUpgradeDisabledWarning}
              enabled={upgradeSelectionEnabled}
              isCreditMethod={method === "ad_credit"}
              onToggle={toggleUpgrade}
              selectedProducts={selectedUpgradeProducts}
              upgradeItems={upgradeItems}
            />
          </>
        ) : null}
      </main>

      <footer className="border-outline-var/30 bg-surface-container-lowest shrink-0 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(26,26,26,0.06)]">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedMethodAvailable || pending}
          onClick={() => onSubmit(upgradeSelectionEnabled ? selectedUpgradeProducts : [])}
          type="button"
        >
          {pending ? "در حال پردازش پرداخت..." : submitLabel}
        </Button>
      </footer>
    </PageFrame>
  );
}

function CheckoutTariffView({
  backTo,
  children,
  freeQuotaRemaining,
  hasFreeQuota,
  onComplete,
  onToggleUpgrade,
  pending,
  price,
  selectedUpgradeProducts = [],
  upgradeItems,
}: {
  backTo: string;
  children?: ReactNode;
  freeQuotaRemaining: number;
  hasFreeQuota: boolean;
  onComplete: () => void;
  onToggleUpgrade?: (product: string) => void;
  pending: boolean;
  price: number;
  selectedUpgradeProducts?: string[];
  upgradeItems: AdvertisementCheckoutItem[];
}) {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={backTo} className="bg-surface-container" title="هزینه ثبت آگهی" />

      {children}

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[76px]">
        <section className="px-4 pt-5 pb-5" aria-label="هزینه ثبت آگهی">
          <div className="flex items-start justify-between gap-5 [direction:ltr]">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface shrink-0 pt-1 text-sm leading-5 font-medium [direction:rtl]"
            >
              {hasFreeQuota ? "رایگان" : `${formatTariffToman(price)} تومان`}
            </Typography>

            <Typography
              as="span"
              variant="label"
              size="large"
              weight="semibold"
              className="flex min-w-0 flex-1 items-center justify-start gap-2 text-right text-base leading-6 font-semibold [direction:rtl]"
            >
              <ChoiceIndicator checked className="h-5 w-5 rounded-[4px]" disabled />
              هزینه ثبت آگهی
            </Typography>
          </div>

          {hasFreeQuota ? (
            <div className="bg-primary-container text-primary mt-4 flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-right [direction:rtl]">
              <LinearInfoCircle className="h-5 w-5 shrink-0" />
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="medium"
                className="text-xs leading-5"
              >
                {new Intl.NumberFormat("fa-IR").format(freeQuotaRemaining)} تعرفه رایگان باقی مانده
                است
              </Typography>
            </div>
          ) : (
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-on-surface-var m-0 mt-4 text-right text-sm leading-6"
            >
              تعرفه رایگان شما به پایان رسیده است. برای ثبت آگهی، هزینه انتشار را پرداخت کنید.
            </Typography>
          )}
        </section>

        <div className="bg-surface-container h-2" aria-hidden="true" />

        <DisabledUpgradeOptionsSection
          disabledWarning={
            hasFreeQuota ? unavailableAfterPublishWarning : unavailableAfterPaidPublishWarning
          }
          enabled
          onToggle={onToggleUpgrade}
          selectedProducts={selectedUpgradeProducts}
          showCombinedOption
          upgradeItems={upgradeItems}
        />
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-3 shadow-sm">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          onClick={onComplete}
          type="button"
        >
          {pending ? "در حال پردازش..." : "تکمیل خرید"}
        </Button>
      </footer>
    </PageFrame>
  );
}

function DisabledUpgradeOptionsSection({
  creditBalances,
  disabledWarning = unavailableAfterPublishWarning,
  enabled = false,
  isCreditMethod = false,
  onToggle,
  selectedProducts = [],
  showCombinedOption = false,
  upgradeItems = [],
}: {
  creditBalances?: { ad_credit: number; special_credit: number; renew_credit: number };
  disabledWarning?: string;
  enabled?: boolean;
  isCreditMethod?: boolean;
  onToggle?: (product: string) => void;
  selectedProducts?: string[];
  showCombinedOption?: boolean;
  upgradeItems?: AdvertisementCheckoutItem[];
}) {
  const visibleOptions = showCombinedOption
    ? disabledUpgradeOptions
    : disabledUpgradeOptions.filter(
        (option) =>
          option.id !== "refresh-special" || selectedProducts.includes("advertise_update_special"),
      );

  return (
    <section className="bg-surface-container-lowest" aria-label="امکانات ارتقای آگهی">
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 flex items-center gap-2 px-4 pt-5 pb-2 text-right text-base leading-6 font-semibold"
      >
        <LinearChartUp className="h-5 w-5" />
        امکانات ارتقای آگهی
      </Typography>

      <div className="divide-outline-var/40 divide-y px-4">
        {visibleOptions.map((option) => {
          const checkoutItem = resolveUpgradeCheckoutItem(option.id, upgradeItems);
          const itemExists = Boolean(checkoutItem);
          const isAvailable = checkoutItem?.available !== false;
          const optionEnabled = Boolean(enabled && itemExists && isAvailable);
          const checked = Boolean(checkoutItem && selectedProducts.includes(checkoutItem.product));
          const itemPrice =
            checkoutItem?.price !== undefined ? toSafeNumber(checkoutItem.price) : 30000;
          const itemCredit = checkoutItem?.credit_requirements?.[0]?.amount ?? 1;
          const unavailableWarning = !itemExists
            ? "این قابلیت در حال حاضر در دسترس نیست."
            : !isAvailable
              ? formatAvailableInNotice(resolveAvailableIn(checkoutItem))
              : disabledWarning;

          return (
            <Button
              unstyled
              aria-disabled={!optionEnabled}
              aria-pressed={checked}
              disabled={!optionEnabled}
              className={`bg-surface-container-lowest block w-full border-0 py-4 text-inherit ${
                optionEnabled ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              key={option.id}
              onClick={() => {
                if (optionEnabled && checkoutItem && onToggle) {
                  onToggle(checkoutItem.product);
                }
              }}
              type="button"
            >
              <div className="flex flex-col gap-3 [direction:rtl]">
                <div className="flex items-center justify-between gap-4">
                  <Typography
                    as="p"
                    variant="title"
                    size="medium"
                    weight="semibold"
                    className={`m-0 flex items-center justify-start gap-2 ${
                      optionEnabled || isCreditMethod ? "text-on-surface" : "text-outline"
                    }`}
                  >
                    <ChoiceIndicator
                      checked={checked}
                      className="h-5 w-5 rounded-[4px]"
                      disabled={!optionEnabled}
                    />
                    {option.title}
                  </Typography>

                  <Typography
                    as="p"
                    variant="label"
                    size="large"
                    weight="semibold"
                    className={`m-0 flex shrink-0 items-center gap-1 ${
                      optionEnabled || isCreditMethod ? "text-on-surface" : "text-outline"
                    }`}
                  >
                    {isCreditMethod ? (
                      `${new Intl.NumberFormat("fa-IR").format(itemCredit)} اعتبار`
                    ) : itemPrice !== undefined ? (
                      <>
                        {formatTariffToman(itemPrice)}
                        <LinearTooman className="h-5 w-5" />
                      </>
                    ) : (
                      "—"
                    )}
                  </Typography>
                </div>

                <Typography
                  as="p"
                  variant="body"
                  size="large"
                  weight="regular"
                  className={`m-0 text-right ${
                    optionEnabled || isCreditMethod ? "text-on-surface-var" : "text-outline"
                  }`}
                >
                  {getUpgradeDescription(option.id, checkoutItem)}
                </Typography>
              </div>

              {enabled && option.id === "refresh" ? (
                <div className="bg-tertiary-container/30 text-tertiary mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs font-medium">
                  <LinearStairs className="h-4 w-4 shrink-0" />
                  <span>
                    اعتبار باقیمانده:{" "}
                    {new Intl.NumberFormat("fa-IR").format(creditBalances?.ad_credit ?? 0)}
                  </span>
                </div>
              ) : enabled && option.id === "special" ? (
                <div className="bg-warning-container/30 text-warning mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs font-medium">
                  <LinearStartup className="h-4 w-4 shrink-0" />
                  <span>
                    اعتبار باقیمانده:{" "}
                    {new Intl.NumberFormat("fa-IR").format(creditBalances?.special_credit ?? 0)}
                  </span>
                </div>
              ) : enabled && option.id === "renew" ? (
                <div className="bg-tertiary-container/30 text-tertiary mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs font-medium">
                  <LinearRefresh className="h-4 w-4 shrink-0" />
                  <span>
                    اعتبار باقیمانده:{" "}
                    {new Intl.NumberFormat("fa-IR").format(creditBalances?.renew_credit ?? 0)}
                  </span>
                </div>
              ) : null}

              {!optionEnabled && (!isCreditMethod || !isAvailable) ? (
                <div className="mt-3">
                  <TariffNotice>{unavailableWarning}</TariffNotice>
                </div>
              ) : null}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

export function ApiPaymentCheckoutView({
  appliedDiscount,
  children,
  discountError,
  discountInput = "",
  discountLoading = false,
  gatewayMethod,
  method,
  onApplyDiscount,
  onBack,
  onDiscountInputChange,
  onMethodChange,
  onRemoveDiscount,
  onSubmit,
  payableAmount,
  pending,
  totalPrice,
  walletMethod,
  submitLabelPrefix = "پرداخت و انتشار",
}: {
  appliedDiscount?: ValidateDiscountCodeResult | null;
  children?: ReactNode;
  discountError?: string | null;
  discountInput?: string;
  discountLoading?: boolean;
  gatewayMethod?: AdvertisementCheckoutPaymentMethod;
  method: PaymentMethod;
  onApplyDiscount?: () => void;
  onBack: () => void;
  onDiscountInputChange?: (value: string) => void;
  onMethodChange: (method: PaymentMethod) => void;
  onRemoveDiscount?: () => void;
  onSubmit: () => void;
  payableAmount: number;
  pending: boolean;
  totalPrice: number;
  walletMethod?: AdvertisementCheckoutPaymentMethod;
  submitLabelPrefix?: string;
}) {
  const is100PercentDiscount = Boolean(
    appliedDiscount?.is_free ||
    appliedDiscount?.disable_gateway ||
    (appliedDiscount && payableAmount === 0),
  );
  const walletBalance = toSafeNumber(walletMethod?.balance);
  const walletRequired = appliedDiscount
    ? Math.max(payableAmount, 0)
    : Math.max(toSafeNumber(walletMethod?.required), Math.max(payableAmount, 0));
  const walletDeficit = appliedDiscount
    ? Math.max(walletRequired - walletBalance, 0)
    : Math.max(toSafeNumber(walletMethod?.shortage), walletRequired - walletBalance, 0);
  // A wallet with insufficient credit is still a valid payment choice: keep it
  // selectable so the shortage and the wallet-charge action are visible.
  const walletSupported = Boolean(walletMethod);
  const walletSufficient = is100PercentDiscount || walletDeficit <= 0;
  const gatewayAvailable =
    !is100PercentDiscount && gatewayMethod?.available !== false && Boolean(gatewayMethod);
  const selectedMethodAvailable = is100PercentDiscount
    ? true
    : method === "wallet"
      ? (walletSupported || payableAmount === 0) && walletSufficient
      : gatewayAvailable;
  const discount = Math.max(totalPrice - payableAmount, 0);

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar className="[&_button]:text-on-surface" onBack={onBack} title="پرداخت" />

      {children}

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[76px]">
        <section className="bg-surface-container-lowest px-4 pt-6 pb-4" aria-label="روش پرداخت">
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-4 text-right text-base leading-6 font-semibold"
          >
            روش پرداخت
          </Typography>
          <PaymentMethodOption
            active={method === "wallet"}
            disabled={!walletSupported}
            icon="wallet"
            label="کیف پول"
            onClick={() => onMethodChange("wallet")}
            subLabel={
              walletSupported
                ? `مانده: ${formatTariffToman(walletBalance)} تومان`
                : "این روش پرداخت در دسترس نیست"
            }
            subLabelClassName={
              walletDeficit > 0 ? "text-error font-medium" : "text-tertiary font-medium"
            }
          />

          {walletSupported && walletDeficit > 0 ? (
            <div className="mt-2.5 mb-2">
              <ApiWalletDeficitBox deficit={walletDeficit} />
            </div>
          ) : null}

          <div className="border-outline-var mt-2 border-t pt-2">
            <PaymentMethodOption
              active={method === "online"}
              disabled={!gatewayAvailable}
              icon="online"
              label="پرداخت آنلاین"
              onClick={() => onMethodChange("online")}
              subLabel={
                is100PercentDiscount
                  ? "درگاه پرداخت برای تخفیف ۱۰۰٪ غیرفعال است"
                  : gatewayAvailable
                    ? "بانک ملت"
                    : "درگاه پرداخت در دسترس نیست"
              }
            />
          </div>
        </section>

        <section className="bg-surface-container-lowest mt-2 px-4 py-4" aria-label="کد تخفیف">
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-3 text-right text-base leading-6 font-semibold"
          >
            کد تخفیف
          </Typography>

          {appliedDiscount ? (
            <div className="border-primary/30 bg-primary-container/20 text-primary flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
              <span className="font-semibold">
                {appliedDiscount.code} ({appliedDiscount.discount_percent}٪ تخفیف)
              </span>
              <button
                type="button"
                onClick={onRemoveDiscount}
                className="text-error cursor-pointer text-xs font-semibold"
              >
                حذف کد
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 [direction:ltr]">
              <Button
                unstyled
                className="bg-primary text-on-primary disabled:bg-surface-container-high disabled:text-outline h-12 shrink-0 rounded-xl px-5 text-sm leading-5 font-semibold shadow-xs transition-colors disabled:cursor-not-allowed"
                disabled={discountLoading || !discountInput.trim() || !onApplyDiscount}
                onClick={onApplyDiscount}
                type="button"
              >
                {discountLoading ? "در حال بررسی..." : "اعمال"}
              </Button>
              <label className="min-w-0 flex-1">
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="sr-only"
                >
                  کد تخفیف
                </Typography>
                <input
                  className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary h-12 w-full rounded-xl border px-4 text-right text-sm leading-5 font-normal outline-none"
                  disabled={discountLoading || !onApplyDiscount}
                  onChange={(e) => {
                    onDiscountInputChange?.(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onApplyDiscount?.();
                    }
                  }}
                  placeholder="کد تخفیف را وارد کنید"
                  type="text"
                  value={discountInput}
                />
              </label>
            </div>
          )}

          {discountError ? (
            <p className="text-error m-0 mt-2 text-right text-xs">{discountError}</p>
          ) : null}
        </section>

        <section
          className="bg-surface-container-lowest mt-2 px-4 pt-5 pb-6"
          aria-label="خلاصه پرداخت"
        >
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-4 text-right text-base leading-6 font-semibold"
          >
            خلاصه پرداخت
          </Typography>
          <SummaryRow label="قیمت" value={formatTariffToman(totalPrice)} />
          <SummaryRow label="تخفیف" value={formatTariffToman(discount)} />
          <div className="border-outline-var my-4 border-t border-dashed" aria-hidden="true" />
          <SummaryRow
            iconClassName="h-6 w-6 text-primary"
            label="جمع پرداختی"
            labelClassName="text-right text-base font-semibold text-on-surface"
            value={formatTariffToman(payableAmount)}
            valueClassName="text-lg font-bold text-primary"
          />
        </section>
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-3 shadow-sm">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedMethodAvailable || pending}
          onClick={onSubmit}
          type="button"
        >
          {pending
            ? "در حال پردازش پرداخت..."
            : is100PercentDiscount
              ? "تأیید و ثبت رایگان"
              : `${submitLabelPrefix} - ${formatShortPayment(payableAmount)}`}
        </Button>
      </footer>
    </PageFrame>
  );
}

function CheckoutStatusPage({
  backTo,
  isLoading = false,
  message,
  onRetry,
  title,
}: {
  backTo: string;
  isLoading?: boolean;
  message: string;
  onRetry?: () => void;
  title: string;
}) {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={backTo} title={title} />
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col items-center justify-center px-6 text-center">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="medium"
          className="text-on-surface-var m-0 text-sm leading-6 font-medium"
        >
          {message}
        </Typography>
        {onRetry ? (
          <Button
            unstyled
            className="bg-primary text-on-primary mt-4 h-10 rounded-lg px-5 text-sm font-medium"
            onClick={onRetry}
            type="button"
          >
            تلاش دوباره
          </Button>
        ) : isLoading ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="border-primary-container border-t-primary mt-4 h-8 w-8 animate-spin rounded-full border-2"
          />
        ) : null}
      </main>
    </PageFrame>
  );
}

function ApiCreditDeficitBox({ deficit }: { deficit: number }) {
  const navigate = useNavigate();

  function openCreditPackages() {
    try {
      sessionStorage.setItem("bonga:paymentReturnTo", window.location.pathname);
    } catch {
      // ignore
    }
    navigate("/account/dashboard/payments", {
      state: {
        initialPaymentTab: "packages",
        returnTo: window.location.pathname,
      },
    });
  }

  return (
    <div className="border-warning/20 bg-warning-container/20 flex h-[60px] items-center justify-between rounded-lg border px-4 [direction:ltr]">
      <Button
        unstyled
        className="bg-tertiary text-on-primary flex shrink-0 items-center justify-center gap-1 rounded-lg px-4 py-1.5 text-xs leading-5 font-semibold"
        onClick={openCreditPackages}
        type="button"
      >
        <Typography variant="label" size="small" weight="medium">
          افزایش اعتبار
        </Typography>
        <LinearAdd className="h-4 w-4" />
      </Button>

      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface text-right [direction:rtl]"
      >
        کسری:{" "}
        <Typography as="span" variant="body" size="medium">
          {new Intl.NumberFormat("fa-IR").format(deficit)} اعتبار
        </Typography>
      </Typography>
    </div>
  );
}

function ApiWalletDeficitBox({ deficit }: { deficit: number }) {
  const chargeWalletMutation = useChargeWalletMutation();
  const { showToast } = useToast();
  const showError = (message: string) => showToast(message, "خطا", "error");

  function chargeWallet() {
    if (chargeWalletMutation.isPending || deficit <= 0) return;

    chargeWalletMutation.mutate(
      { price: Math.ceil(deficit) },
      {
        onError: (error: unknown) => {
          showError(getApiErrorMessage(error, "شارژ کیف پول با خطا مواجه شد."));
        },
        onSuccess: ({ paymentUrl }) => {
          storePaymentReturnTarget({
            label: "بازگشت به پرداخت آگهی",
            path: window.location.pathname,
          });
          window.location.assign(paymentUrl);
        },
      },
    );
  }

  return (
    <div>
      <div className="flex h-[56px] items-center justify-between rounded-xl border border-[#FFE8CC] bg-[#FFF8EE] px-4 [direction:ltr]">
        <Button
          unstyled
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#00966D] px-3.5 py-2 text-xs leading-5 font-semibold text-white shadow-xs transition-colors disabled:opacity-60"
          disabled={chargeWalletMutation.isPending}
          onClick={chargeWallet}
          type="button"
        >
          <span className="text-sm leading-none font-bold select-none">+</span>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-white"
          >
            {chargeWalletMutation.isPending ? "در حال اتصال..." : "افزایش موجودی"}
          </Typography>
        </Button>

        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-on-surface text-right text-sm leading-5 font-medium [direction:rtl]"
        >
          کسری: {formatTariffToman(deficit)} تومان
        </Typography>
      </div>
    </div>
  );
}

function PaymentMethodOption({
  active,
  disabled = false,
  icon,
  label,
  onClick,
  subLabel,
  subLabelClassName = "text-outline",
}: {
  active: boolean;
  disabled?: boolean;
  icon: "consultant" | "credit" | "online" | "wallet";
  label: string;
  onClick: () => void;
  subLabel: string;
  subLabelClassName?: string;
}) {
  return (
    <Button
      unstyled
      aria-pressed={active}
      className={`bg-surface-container-lowest flex h-[72px] w-full items-center justify-between border-0 px-4 text-inherit [direction:ltr] ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <ChoiceIndicator
        checked={active}
        className={`ml-1 ${!active && !disabled ? "!border-outline-var" : ""}`}
        disabled={disabled}
        type="radio"
      />
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="inline-flex items-center gap-2 text-right [direction:rtl]"
      >
        <PaymentOptionIcon className="text-on-surface-var h-6 w-6 shrink-0" icon={icon} />
        <Typography as="span" variant="body" size="medium" weight="regular" className="block">
          <strong className="text-on-surface block text-base leading-6 font-normal">{label}</strong>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={`block text-sm leading-5 font-normal ${subLabelClassName}`}
          >
            {subLabel}
          </Typography>
        </Typography>
      </Typography>
    </Button>
  );
}

function SummaryRow({
  iconClassName = "mr-0.5 h-5 w-5 text-on-surface-var",
  label,
  labelClassName = "text-right font-medium text-on-surface-var",
  value,
  valueClassName = "font-medium text-on-surface",
}: {
  iconClassName?: string;
  label: string;
  labelClassName?: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4 text-sm leading-5 [direction:ltr]">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`flex items-center text-left [direction:rtl] ${valueClassName}`}
      >
        {value}
        <LinearTooman className={iconClassName} />
      </Typography>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`[direction:rtl] ${labelClassName}`}
      >
        {label}
      </Typography>
    </div>
  );
}
