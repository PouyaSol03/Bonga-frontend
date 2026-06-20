import { type ComponentType, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { BottomSheet, BottomSheetActionList } from "../components/BottomSheet";
import { DemoNotice } from "../components/DemoNotice";
import { useDemoNotice } from "../hooks/useDemoNotice";
import { TopBar } from "../components/TopBar";
import { PageFrame } from "../app/PageFrame";
import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
import { RouteLink } from "../routes/RouteLink";
import { getBrowserLocation, getBrowserLocationNotice } from "../lib/browserLocation";

type ChatItem = {
  adCategory: string;
  adLabel: string;
  adTitle: string;
  badgeCount?: string;
  date: string;
  highlighted?: boolean;
  isBlocked?: boolean;
  message: string;
  userName: string;
};

type SentChatMessage =
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; imageUrl: string; fileName: string }
  | { id: string; type: "location"; latitude: number; longitude: number; mapsUrl: string };

const createChatMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const filters = ["پشتیبانی", "خوانده نشده", "آگهی‌های من", "آگهی‌های دیگران"];

const chatItems: ChatItem[] = [
  {
    adCategory: "اجاره روزانه باغ ویلا",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    badgeCount: "2",
    date: "12 فروردین",
    highlighted: true,
    isBlocked: true,
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
  {
    adCategory: "اجاره آپارتمان",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    badgeCount: "1",
    date: "12 فروردین",
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
  {
    adCategory: "باغ ویلا با استخر آب گرم",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    date: "03/12/6",
    isBlocked: true,
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
  {
    adCategory: "باغ ویلا با استخر آب گرم",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    date: "12/2",
    isBlocked: true,
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
  {
    adCategory: "باغ ویلا با استخر آب گرم",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    date: "12/2",
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
];

const chatCardOverrides: Partial<ChatItem>[] = [
  {},
  {
    adCategory: "فروش آپارتمان",
    badgeCount: undefined,
    date: "25 خرداد",
    isBlocked: true,
  },
  {
    adCategory: "اجاره آپارتمان",
    date: "6 شهریور",
    isBlocked: true,
  },
];

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.2 16.2 3.8 3.8" />
    </svg>
  );
}

function MoreVerticalIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M11.9919 12.0004H12.0009M11.9829 6H11.9919M11.9921 18H12.001" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function BlockedIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5.7 5.7L18.3 18.3M21 12C21 7.02944 16.9705 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9705 7.02944 21 12 21C16.9705 21 21 16.9705 21 12Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 18 18"
    >
      <path d="m5.1 9.1 2.3 2.3 5.5-5.5" />
    </svg>
  );
}


function LinkChainIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12.0864 5.86813L13.6409 4.31357C15.358 2.59645 18.1034 2.55778 19.7728 4.22721C21.4422 5.8966 21.4036 8.64196 19.6864 10.3591L10.3591 19.6865C8.64198 21.4035 5.89659 21.4422 4.22719 19.7728C2.55777 18.1034 2.59647 15.358 4.31356 13.6409L7.81132 10.1432C8.88451 9.06998 10.6004 9.04581 11.6437 10.0892C12.6871 11.1326 12.663 12.8484 11.5898 13.9216L9.64657 15.8648" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function SendMessageIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M10.6 13.4 13.4 10.6" />
      <path d="M10.6 13.4 3.70058 11.8502C2.82251 11.6506 2.74934 10.4279 3.59735 10.125L17.7955 5.05425C18.5106 4.79885 19.2011 5.48933 18.9458 6.20445L13.875 20.4026C13.5721 21.2506 12.3494 21.1775 12.1498 20.2994L10.6 13.4Z" />
    </svg>
  );
}

function CameraIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 6.5V7.25C8.32097 7.25 8.60636 7.04575 8.70991 6.74194L8 6.5ZM8.64487 4.6078L9.35478 4.84974L9.35549 4.84762L8.64487 4.6078ZM15.3551 4.6078L14.6445 4.84761L14.6452 4.84974L15.3551 4.6078ZM16 6.5L15.2901 6.74195C15.3936 7.04575 15.679 7.25 16 7.25V6.5ZM15.1526 13.7778H14.4026C14.4026 15.0728 13.3366 16.1389 12.0013 16.1389V16.8889V17.6389C14.1469 17.6389 15.9026 15.9192 15.9026 13.7778H15.1526ZM12.0013 16.8889V16.1389C10.666 16.1389 9.6 15.0727 9.6 13.7778H8.85H8.1C8.1 15.9193 9.85584 17.6389 12.0013 17.6389V16.8889ZM8.85 13.7778H9.6C9.6 12.4828 10.666 11.4167 12.0013 11.4167V10.6667V9.91667C9.85584 9.91667 8.1 11.6363 8.1 13.7778H8.85ZM12.0013 10.6667V11.4167C13.3366 11.4167 14.4026 12.4828 14.4026 13.7778H15.1526H15.9026C15.9026 11.6363 14.1469 9.91667 12.0013 9.91667V10.6667ZM5 6.5V7.25H8V6.5V5.75H5V6.5ZM8 6.5L8.70991 6.74194L9.35478 4.84973L8.64487 4.6078L7.93497 4.36586L7.29009 6.25806L8 6.5ZM8.64487 4.6078L9.35549 4.84762C9.37352 4.79422 9.42814 4.75 9.49868 4.75V4V3.25C8.79446 3.25 8.16122 3.69544 7.93425 4.36797L8.64487 4.6078ZM9.49868 4V4.75H14.5013V4V3.25H9.49868V4ZM14.5013 4V4.75C14.5719 4.75 14.6265 4.79422 14.6445 4.84761L15.3551 4.6078L16.0657 4.36798C15.8388 3.69544 15.2056 3.25 14.5013 3.25V4ZM15.3551 4.6078L14.6452 4.84974L15.2901 6.74195L16 6.5L16.7099 6.25805L16.065 4.36585L15.3551 4.6078ZM16 6.5V7.25H19V6.5V5.75H16V6.5ZM19 6.5V7.25C19.2525 7.25 19.5717 7.38504 19.843 7.65585C20.1141 7.92646 20.25 8.24527 20.25 8.5H21H21.75C21.75 7.75473 21.3829 7.07354 20.9026 6.59415C20.4225 6.11496 19.7416 5.75 19 5.75V6.5ZM21 8.5H20.25V18H21H21.75V8.5H21ZM21 18H20.25C20.25 18.2561 20.1144 18.5749 19.8447 18.8447C19.5749 19.1144 19.2561 19.25 19 19.25V20V20.75C19.7439 20.75 20.4251 20.3856 20.9053 19.9053C21.3856 19.4251 21.75 18.7439 21.75 18H21ZM19 20V19.25H5V20V20.75H19V20ZM5 20V19.25C4.74392 19.25 4.42507 19.1144 4.15533 18.8447C3.88559 18.5749 3.75 18.2561 3.75 18H3H2.25C2.25 18.7439 2.61441 19.4251 3.09467 19.9053C3.57493 20.3856 4.25608 20.75 5 20.75V20ZM3 18H3.75V8.5H3H2.25V18H3ZM3 8.5H3.75C3.75 8.24527 3.88587 7.92647 4.15702 7.65585C4.42836 7.38503 4.74751 7.25 5 7.25V6.5V5.75C4.25838 5.75 3.57752 6.11497 3.0974 6.59415C2.61707 7.07353 2.25 7.75473 2.25 8.5H3Z" fill="#4D4D4D" />
    </svg>
  );
}

function AlbumIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17.4 6.6H19.2C20.1941 6.6 21 7.40589 21 8.4V19.2C21 20.1941 20.1941 21 19.2 21H8.4C7.40589 21 6.6 20.1941 6.6 19.2V17.4M3 11.2066C3.55712 11.1358 4.12036 11.1009 4.68454 11.1021C7.07129 11.058 9.39958 11.7087 11.254 12.9382C12.9738 14.0785 14.1822 15.6477 14.7 17.4M12.8998 7.5H12.9079M17.4 15.6V4.8C17.4 3.80589 16.5941 3 15.6 3H4.8C3.80589 3 3 3.80589 3 4.8V15.6C3 16.5941 3.80589 17.4 4.8 17.4H15.6C16.5941 17.4 17.4 16.5941 17.4 15.6Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function MapLocationIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20.25 10.3569C20.25 10.7711 20.5858 11.1069 21 11.1069C21.4142 11.1069 21.75 10.7711 21.75 10.3569H21H20.25ZM8.78367 3.16801L9.08452 2.481L9.08451 2.481L8.78367 3.16801ZM8.02665 3.19075L8.36787 3.85863L8.36788 3.85862L8.02665 3.19075ZM3.49751 5.50466L3.83872 6.17255L3.83873 6.17254L3.49751 5.50466ZM4.18461 18.2299L4.42637 18.9399L4.42642 18.9399L4.18461 18.2299ZM10.7992 18.6635C11.1786 18.8297 11.6209 18.6568 11.787 18.2773C11.9532 17.8979 11.7803 17.4556 11.4008 17.2895L11.1 17.9765L10.7992 18.6635ZM13.95 9.89707C13.95 10.3113 14.2858 10.6471 14.7 10.6471C15.1142 10.6471 15.45 10.3113 15.45 9.89707H14.7H13.95ZM16.988 20.7987L17.5771 20.3345L17.5771 20.3345L16.988 20.7987ZM17.8263 20.8093L18.407 21.2839L18.4071 21.2838L17.8263 20.8093ZM17.4 15.1245C16.9858 15.1245 16.65 15.4603 16.65 15.8745C16.65 16.2887 16.9858 16.6245 17.4 16.6245V15.8745V15.1245ZM17.4081 16.6245C17.8223 16.6245 18.1581 16.2887 18.1581 15.8745C18.1581 15.4603 17.8223 15.1245 17.4081 15.1245V15.8745V16.6245ZM21 10.3569H21.75V6.67844H21H20.25V10.3569H21ZM21 6.67844H21.75C21.75 5.77167 21.0265 5.00883 20.1 5.00883V5.75883V6.50883C20.1677 6.50883 20.25 6.56944 20.25 6.67844H21ZM20.1 5.75883V5.00883H14.7V5.75883V6.50883H20.1V5.75883ZM14.7 5.75883L15.0008 5.07181L9.08452 2.481L8.78367 3.16801L8.48282 3.85503L14.3991 6.44584L14.7 5.75883ZM8.78367 3.16801L9.08451 2.481C8.63489 2.28411 8.12231 2.29965 7.68542 2.52287L8.02665 3.19075L8.36788 3.85862C8.40456 3.83989 8.44578 3.83881 8.48283 3.85503L8.78367 3.16801ZM8.02665 3.19075L7.68543 2.52286L3.15629 4.83677L3.49751 5.50466L3.83873 6.17254L8.36787 3.85863L8.02665 3.19075ZM3.49751 5.50466L3.1563 4.83677C2.59503 5.12351 2.25 5.7033 2.25 6.32718H3H3.75C3.75 6.25441 3.79017 6.19735 3.83872 6.17255L3.49751 5.50466ZM3 6.32718H2.25V17.3575H3H3.75V6.32718H3ZM3 17.3575H2.25C2.25 18.4758 3.33522 19.3115 4.42637 18.9399L4.18461 18.2299L3.94284 17.52C3.86844 17.5453 3.75 17.4945 3.75 17.3575H3ZM4.18461 18.2299L4.42642 18.9399L8.64181 17.5041L8.4 16.7941L8.15819 16.0842L3.94279 17.52L4.18461 18.2299ZM8.4 16.7941L8.09915 17.4812L10.7992 18.6635L11.1 17.9765L11.4008 17.2895L8.70085 16.1071L8.4 16.7941ZM8.4 3H7.65V16.7941H8.4H9.15V3H8.4ZM14.7 5.75883H13.95V9.89707H14.7H15.45V5.75883H14.7ZM17.4 12.1961V11.4461C14.9754 11.4461 13.05 13.4679 13.05 15.9117H13.8H14.55C14.55 14.2513 15.8482 12.9461 17.4 12.9461V12.1961ZM13.8 15.9117H13.05C13.05 17.2717 13.6639 18.2727 14.3647 19.0898C14.7091 19.4913 15.0936 19.8697 15.4406 20.2186C15.7973 20.577 16.1219 20.9114 16.3989 21.2629L16.988 20.7987L17.5771 20.3345C17.2406 19.9075 16.8601 19.5185 16.504 19.1606C16.1383 18.7931 15.8025 18.4621 15.5032 18.1132C14.9167 17.4295 14.55 16.7655 14.55 15.9117H13.8ZM16.988 20.7987L16.3989 21.2628C16.8983 21.8967 17.8865 21.9207 18.407 21.2839L17.8263 20.8093L17.2456 20.3346C17.2998 20.2684 17.3698 20.2494 17.4158 20.25C17.4613 20.2506 17.5269 20.2708 17.5771 20.3345L16.988 20.7987ZM17.8263 20.8093L18.4071 21.2838C18.6936 20.9333 19.0236 20.5959 19.3828 20.2315C19.7335 19.8758 20.1143 19.4921 20.4565 19.0829C21.1486 18.2553 21.75 17.2461 21.75 15.9117H21H20.25C20.25 16.7479 19.8886 17.4239 19.3059 18.1206C19.0106 18.4736 18.676 18.8119 18.3146 19.1784C17.9618 19.5363 17.5831 19.9216 17.2456 20.3347L17.8263 20.8093ZM21 15.9117H21.75C21.75 13.4679 19.8246 11.4461 17.4 11.4461V12.1961V12.9461C18.9518 12.9461 20.25 14.2513 20.25 15.9117H21ZM17.4 15.8745V16.6245H17.4081V15.8745V15.1245H17.4V15.8745Z" fill="#4D4D4D" />
    </svg>
  );
}

function DoubleTickIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="m3.5 12.5 3.5 3.5 7-8" />
      <path d="m11 15.5 1 1 8-9" />
    </svg>
  );
}

function ClockAlarmIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M8 2.75 3.75 6.2" />
      <path d="M16 2.75 20.25 6.2" />
      <path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 8.5V12l2.5 2.2" />
      <path d="m7.5 20.5-1.4 1.4" />
      <path d="m16.5 20.5 1.4 1.4" />
    </svg>
  );
}

function HeadphoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M4 13.2v-1.4a8 8 0 0 1 16 0v1.4" />
      <path d="M4 13.4a2.2 2.2 0 0 1 2.2-2.2H8v6H6.2A2.2 2.2 0 0 1 4 15v-1.6Z" />
      <path d="M20 13.4a2.2 2.2 0 0 0-2.2-2.2H16v6h1.8A2.2 2.2 0 0 0 20 15v-1.6Z" />
      <path d="M16 18.5h-2.2a2 2 0 0 1-2-2V16" />
    </svg>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18.6667 6.15L17.879 19.3089C17.8221 20.2589 17.0445 21 16.1044 21H7.89552C6.95545 21 6.17787 20.2589 6.121 19.3089L5.33333 6.15M4 6.15H8.44444M8.44444 6.15L9.54689 3.54547C9.68696 3.21456 10.0083 3 10.3639 3H13.6361C13.9916 3 14.3131 3.21456 14.4531 3.54547L15.5556 6.15M8.44444 6.15H15.5556M20 6.15H15.5556M9.77778 16.05V10.65M14.2222 16.05V10.65" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V11.5M12 8.01172V8.00172M21 15.3971V8.60294C21 8.35168 20.9001 8.11071 20.7225 7.93305L16.067 3.27747C15.8893 3.09981 15.6483 3 15.3971 3H8.60294C8.35168 3 8.11071 3.09981 7.93305 3.27747L3.27747 7.93305C3.09981 8.11071 3 8.35168 3 8.60294V15.3971C3 15.6483 3.09981 15.8893 3.27747 16.067L7.93305 20.7225C8.11071 20.9001 8.35168 21 8.60294 21H15.3971C15.6483 21 15.8893 20.9001 16.067 20.7225L20.7225 16.067C20.9001 15.8893 21 15.6483 21 15.3971Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function SettingsIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2.05 2.05 0 0 1-2.9 2.9l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2.05 2.05 0 0 1-4.1 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2.05 2.05 0 0 1-2.9-2.9l.06-.06A1.7 1.7 0 0 0 4.3 15a1.7 1.7 0 0 0-1.56-1.03h-.09a2.05 2.05 0 0 1 0-4.1h.09A1.7 1.7 0 0 0 4.3 8.74a1.7 1.7 0 0 0-.34-1.87L3.9 6.8a2.05 2.05 0 0 1 2.9-2.9l.06.06A1.7 1.7 0 0 0 8.73 4.3h.08a1.7 1.7 0 0 0 1.03-1.56v-.09a2.05 2.05 0 0 1 4.1 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2.05 2.05 0 0 1 2.9 2.9l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03h.09a2.05 2.05 0 0 1 0 4.1h-.09A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

function ChatHeader({
  onOpenMenu,
  onOpenSearch,
}: {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: onOpenMenu,
        },
        {
          icon: <SearchIcon className="h-6 w-6" />,
          id: "search",
          label: "جستجو در چت‌ها",
          onClick: onOpenSearch,
        },
      ]}
      backTo="/home"
      title="چت و اعلان‌‌ها"
    />
  );
}

function FilterTabs({
  activeFilter,
  onSelect,
}: {
  activeFilter: string | null;
  onSelect: (filter: string) => void;
}) {
  return (
    <section className="h-[52px] shrink-0 overflow-hidden bg-[#f0f0f0] px-4 py-2">
      <div className="flex h-9 gap-2 overflow-x-auto [direction:rtl] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((filter) => (
          <button
            aria-pressed={activeFilter === filter}
            className={`flex h-9 shrink-0 items-center justify-center rounded-lg border px-4 text-sm font-medium leading-5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${activeFilter === filter
              ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
              : "border-[#cccccc] bg-white text-[#4d4d4d]"
              }`}
            key={filter}
            onClick={() => onSelect(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}

const chatMenuItems = [
  {
    id: "hours",
    icon: ClockAlarmIcon,
    title: "ساعات پاسخگویی",
  },
  {
    id: "bulk-delete",
    icon: BlockedIcon,
    title: "حذف گروهی گفتگوها",
  },
  {
    id: "settings",
    icon: SettingsIcon,
    title: "تنظیمات",
  },
];

function ChatMenuBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="منوی چت"
      contentClassName="mt-4"
      heightClassName="h-[298px]"
      isOpen={isOpen}
      onClose={onClose}
      scrimClassName="bg-[#1a1a1a]/35"
      title="چت"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        items={chatMenuItems.map((item) => ({
          id: item.id,
          title: item.title,
          Icon: item.icon,
        }))}
        onSelect={(item) => onSelect(item.id)}
      />
    </BottomSheet>
  );
}

function UnreadBadge({ count }: { count?: string }) {
  if (!count) return null;

  return (
    <span className="grid h-4 min-w-3.5 place-items-center rounded-full bg-[#0048c4] px-1 text-xs font-medium leading-4 text-white">
      {count}
    </span>
  );
}

function BlockedBadge() {
  return (
    <span className="flex h-5 items-center gap-1 rounded-lg bg-[#dd2b1e1f] px-2 text-xs font-normal leading-4 text-[#c11004]">
      <BlockedIcon className="h-3 w-3" />
      <span>مسدود</span>
    </span>
  );
}

function SelectionCheckbox({
  isSelected,
  onToggle,
}: {
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      aria-pressed={isSelected}
      aria-label={isSelected ? "برداشتن انتخاب گفتگو" : "انتخاب گفتگو"}
      className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      type="button"
    >
      <span
        className={`grid h-[18px] w-[18px] place-items-center rounded border ${isSelected
          ? "border-[#0048c4] bg-[#0048c4] text-white"
          : "border-[#808080] bg-white text-transparent"
          }`}
      >
        <CheckIcon className="h-[14px] w-[14px]" />
      </span>
    </button>
  );
}

function ChatCard({
  index,
  isBulkDeleteMode,
  isSelected,
  item,
  onToggleSelected,
}: {
  index: number;
  isBulkDeleteMode: boolean;
  isSelected: boolean;
  item: ChatItem;
  onToggleSelected: () => void;
}) {
  const displayItem = { ...item, ...chatCardOverrides[index] };
  const isHighlighted = isBulkDeleteMode
    ? isSelected
    : Boolean(displayItem.highlighted);

  const cardClassName = `relative h-[140px] shrink-0 overflow-visible border-b border-[#f0f0f0] px-4 py-4 text-right ${isHighlighted ? "bg-[#0048c41f]" : "bg-white"
    }`;

  const cardContent = (
    <article
      aria-pressed={isBulkDeleteMode ? isSelected : undefined}
      className={cardClassName}
      onClick={isBulkDeleteMode ? onToggleSelected : undefined}
      onKeyDown={
        isBulkDeleteMode
          ? (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            onToggleSelected();
          }
          : undefined
      }
      role={isBulkDeleteMode ? "button" : undefined}
      tabIndex={isBulkDeleteMode ? 0 : undefined}
    >
      <div
        className={`flex items-start justify-between [direction:ltr] ${isBulkDeleteMode ? "h-12" : "h-5"
          }`}
      >
        <div className={isBulkDeleteMode ? "w-[276px] min-w-0" : "w-full min-w-0"}>
          <div className="flex h-5 items-center justify-between [direction:ltr]">
            <div className="flex items-center gap-2 text-xs font-normal leading-4 text-[#808080]">
              <span>{displayItem.date}</span>
              <UnreadBadge count={displayItem.badgeCount} />
            </div>

            <div className="flex min-w-0 items-center gap-4 [direction:rtl]">
              <span className="flex min-w-0 items-center gap-1 text-sm font-medium leading-5 text-[#1a1a1a]">
                <UserIcon className="h-5 w-5 text-[#4d4d4d]" />
                <span className="truncate">{displayItem.userName}</span>
              </span>
              {displayItem.isBlocked ? <BlockedBadge /> : null}
            </div>
          </div>

          {isBulkDeleteMode ? (
            <p className="mt-3 line-clamp-1 text-right text-xs font-normal leading-4 text-[#4d4d4d]">
              {displayItem.message}
            </p>
          ) : null}
        </div>

        {isBulkDeleteMode ? (
          <SelectionCheckbox isSelected={isSelected} onToggle={onToggleSelected} />
        ) : null}
      </div>

      {!isBulkDeleteMode ? (
        <p className="mt-3 line-clamp-1 text-right text-xs font-normal leading-4 text-[#4d4d4d]">
          {displayItem.message}
        </p>
      ) : null}

      <div className="mt-3 flex h-12 items-center justify-between [direction:ltr]">
        <div className="min-w-0 flex-1 pr-2 text-right">
          <div className="flex h-5 items-center justify-end gap-2 [direction:rtl]">
            <span className="rounded bg-[#0048c414] px-2 py-0.5 text-xs font-normal leading-4 text-[#0048c4]">
              {displayItem.adLabel}
            </span>
            <span className="truncate text-xs font-normal leading-4 text-[#808080]">
              {displayItem.adCategory}
            </span>
          </div>
          <div className="mt-2 truncate text-sm font-medium leading-5 text-[#1a1a1a]">
            {displayItem.adTitle}
          </div>
        </div>
        <img
          alt=""
          className="h-12 w-[72px] shrink-0 rounded object-cover"
          src="/figma/view-ad-album.png"
        />
      </div>
    </article>
  );

  if (isBulkDeleteMode) {
    return cardContent;
  }

  return (
    <RouteLink
      aria-label={`${displayItem.userName} - ${displayItem.adTitle}`}
      className="block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
      to={`/chat/${index + 1}`}
    >
      {cardContent}
    </RouteLink>
  );
}

function ChatDetailHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon className="h-6 w-6" />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: onOpenMenu,
        },
      ]}
      backLabel="بازگشت به چت‌ها"
      backTo="/chat"
      className="border-b border-[#e6e6e6]"
      contentClassName="px-0"
      heightClassName="h-[52px]"
      title="آژانس جلالیان"
      titleClassName="text-base font-semibold leading-6"
    />
  );
}

function ChatPropertyStrip() {
  return (
    <section className="flex shrink-0 items-center gap-2 bg-[#F5F5F5] py-2 px-4 text-right [direction:rtl]">
      <img
        alt=""
        className="h-10 w-[54px] shrink-0 rounded-md object-cover"
        src="/figma/view-ad-album.png"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-normal leading-4 text-[#1a1a1a]">
          فروش مسکونی / آپارتمان
        </p>
        <p className="mt-1 truncate text-xs font-medium leading-4 text-[#1a1a1a]">
          ۱۳۰متر - دونبش جنوبی - معاوضه با آپارتمان شما
        </p>
      </div>
    </section>
  );
}

function AgencyResponseCard() {
  return (
    <section className="h-[84px] rounded-lg border border-[#0048c4] bg-[#eef4ff] px-3 py-2 text-right">
      <div className="flex h-5 items-center gap-1.5 [direction:rtl]">
        <HeadphoneIcon className="h-5 w-5 shrink-0 text-[#0048c4]" />
        <h2 className="text-sm font-semibold leading-5 text-[#0048c4]">
          ساعت پاسخگویی آژانس
        </h2>
      </div>
      <div className="mt-2 space-y-1 text-xs font-normal leading-4">
        <p className="flex items-center justify-between gap-3">
          <span className="text-[#808080]">روزهای هفته:</span>
          <span className="text-[#1a1a1a]">شنبه تا چهارشنبه</span>
        </p>
        <p className="flex items-center justify-between gap-3">
          <span className="text-[#808080]">ساعت:</span>
          <span className="text-[#1a1a1a]">از 8 صبح - تا 9 شب</span>
        </p>
      </div>
    </section>
  );
}

function ChatBubble({
  children,
  direction,
  time = "18:21",
  wide = false,
}: {
  children: ReactNode;
  direction: "incoming" | "outgoing";
  time?: string;
  wide?: boolean;
}) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className={`flex [direction:ltr] ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`${wide ? "w-[168px]" : "w-fit min-w-[72px] max-w-[198px]"} rounded-lg px-3 py-2 text-right ${isOutgoing
          ? "bg-[#eef3fb] rounded-tr-none"
          : "border border-[#e6e6e6] bg-white rounded-tl-none"
          }`}
        dir="rtl"
      >
        <p className="whitespace-pre-line text-[11px] font-normal leading-[18px] text-[#1a1a1a]">
          {children}
        </p>
        <div
          className={`mt-1 flex items-center gap-1 text-[10px] font-normal leading-4 ${isOutgoing ? "justify-end [direction:ltr] text-[#0048c4]" : "justify-start text-[#808080]"
            }`}
        >
          <span>{time}</span>
          {isOutgoing ? <DoubleTickIcon className="h-3.5 w-3.5 text-[#0048c4]" /> : null}
        </div>
      </div>
    </div>
  );
}

function ChatDateChip() {
  return (
    <div className="flex justify-center py-0.5">
      <span className="rounded-lg bg-[#f5f5f5] px-3 py-1 text-[10px] font-normal leading-4 text-[#808080]">
        22 بهمن
      </span>
    </div>
  );
}


function ChatImageBubble({ fileName, imageUrl }: { fileName: string; imageUrl: string }) {
  return (
    <div className="flex justify-end [direction:ltr]">
      <div className="max-w-[220px] rounded-lg rounded-tr-none bg-[#eef3fb] p-1.5 text-right" dir="rtl">
        <a href={imageUrl} target="_blank" rel="noreferrer" aria-label={`مشاهده ${fileName}`}>
          <img
            alt={fileName || "تصویر ارسالی"}
            className="max-h-[220px] w-full rounded-md object-cover"
            src={imageUrl}
          />
        </a>
        <div className="mt-1 flex items-center justify-between gap-2 px-1 text-[10px] leading-4 text-[#0048c4] [direction:ltr]">
          <span>18:21</span>
          <DoubleTickIcon className="h-3.5 w-3.5 text-[#0048c4]" />
        </div>
      </div>
    </div>
  );
}

function ChatLocationBubble({ mapsUrl }: { mapsUrl: string }) {
  return (
    <div className="flex justify-end [direction:ltr]">
      <a
        className="block w-[220px] rounded-lg rounded-tr-none bg-[#eef3fb] px-3 py-2 text-right no-underline"
        dir="rtl"
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="flex items-center gap-2 [direction:rtl]">
          <MapLocationIcon />
          <span className="text-xs font-medium leading-5 text-[#1a1a1a]">
            موقعیت در نقشه
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#4d4d4d]">
          برای مشاهده موقعیت روی نقشه لمس کنید.
        </p>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] leading-4 text-[#0048c4] [direction:ltr]">
          <span>18:21</span>
          <DoubleTickIcon className="h-3.5 w-3.5 text-[#0048c4]" />
        </div>
      </a>
    </div>
  );
}

function SentChatMessageBubble({ message }: { message: SentChatMessage }) {
  if (message.type === "image") {
    return <ChatImageBubble fileName={message.fileName} imageUrl={message.imageUrl} />;
  }

  if (message.type === "location") {
    return <ChatLocationBubble mapsUrl={message.mapsUrl} />;
  }

  return <ChatBubble direction="outgoing">{message.text}</ChatBubble>;
}

function ChatComposer({
  message,
  onChangeMessage,
  onOpenAttach,
  onSend,
}: {
  message: string;
  onChangeMessage: (message: string) => void;
  onOpenAttach: () => void;
  onSend: () => void;
}) {
  return (
    <footer className="shrink-0 bg-transparent px-2 pb-4 pt-1">
      <div className="flex items-center gap-2 rounded-full border border-transparent p-1.5 [direction:ltr] shadow-[0_-1px_0px_0px_#FFFFFF] [background:linear-gradient(#CCCCCC29,#CCCCCC29)_padding-box,linear-gradient(to_bottom,transparent,#CCCCCC29)_border-box]">
        <button
          aria-label="ارسال فایل"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#808080] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={onOpenAttach}
          type="button"
        >
          <LinkChainIcon className="h-6 w-6" />
        </button>

        <label className="min-w-0 flex-1">
          <span className="sr-only">پیام خود را بنویسید</span>
          <input
            className="h-11 w-full rounded-xl border-0 px-2 text-right text-[12px] leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:ring-0"
            dir="rtl"
            placeholder="پیام خود را بنویسید"
            type="text"
            value={message}
            onChange={(event) => onChangeMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSend();
              }
            }}
          />
        </label>

        <button
          aria-label="ارسال پیام"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0048c4] text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#003da8]"
          onClick={onSend}
          type="button"
        >
          <SendMessageIcon className="h-6 w-6" />
        </button>
      </div>
    </footer>
  );
}

type SendFileOptionId = "camera" | "gallery" | "map";

type SendFileOption = {
  id: SendFileOptionId;
  title: string;
  Icon: ComponentType<{ className?: string }>;
};

const sendFileOptions: SendFileOption[] = [
  {
    id: "camera",
    title: "عکس با دوربین",
    Icon: CameraIcon,
  },
  {
    id: "gallery",
    title: "عکس از گالری",
    Icon: AlbumIcon,
  },
  {
    id: "map",
    title: "موقعیت در نقشه",
    Icon: MapLocationIcon,
  },
];

function SendFileBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: SendFileOption["id"]) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="ارسال فایل"
      className="rounded-t-[18px]"
      contentClassName="mt-2"
      heightClassName="h-[260px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-2"
      scrimClassName="bg-[#1a1a1a]/65"
      title="ارسال"
      zIndexClassName="z-[60]"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        itemClassName="h-11 text-[12px] leading-5"
        items={sendFileOptions}
        onSelect={(item) => onSelect(item.id)}
      />
    </BottomSheet>
  );
}

const chatSettingsOptions = [
  {
    id: "block",
    title: "مسدود کردن",
    Icon: BlockedIcon,
  },
  {
    id: "delete",
    title: "حذف مکالمه",
    Icon: TrashIcon,
  },
  {
    id: "report",
    title: "گزارش تخلف",
    Icon: InfoIcon,
  },
];

function ChatSettingsBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="تنظیمات مکالمه"
      className="rounded-t-[18px]"
      contentClassName="mt-2"
      heightClassName="h-[260px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-2"
      scrimClassName="bg-[#1a1a1a]/65"
      title="تنظیمات مکالمه"
      zIndexClassName="z-[60]"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        itemClassName="h-11 text-[12px] leading-5"
        items={chatSettingsOptions}
        onSelect={(item) => onSelect(item.title)}
      />
    </BottomSheet>
  );
}

export function UserChatDetailPage() {
  const [isSendFileSheetOpen, setIsSendFileSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<SentChatMessage[]>([]);
  const [isSendingLocation, setIsSendingLocation] = useState(false);
  const { message, showNotice } = useDemoNotice();
  const chatScrollRef = useRef<HTMLElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const imageObjectUrlsRef = useRef<string[]>([]);
  const [hasMoreMessagesBelow, setHasMoreMessagesBelow] = useState(false);

  const updateScrollShadow = useCallback(() => {
    const scrollElement = chatScrollRef.current;
    if (!scrollElement) return;
    const distanceFromBottom =
      scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    setHasMoreMessagesBelow(distanceFromBottom > 8);
  }, []);

  useEffect(() => {
    updateScrollShadow();
    const frame = window.requestAnimationFrame(updateScrollShadow);
    window.addEventListener("resize", updateScrollShadow);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateScrollShadow);
    };
  }, [sentMessages.length, updateScrollShadow]);

  useEffect(() => {
    const scrollElement = chatScrollRef.current;
    if (!scrollElement) return;

    scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" });
  }, [sentMessages.length]);

  useEffect(() => {
    return () => {
      imageObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      imageObjectUrlsRef.current = [];
    };
  }, []);

  const sendMessage = (nextMessage = draftMessage) => {
    const text = nextMessage.trim();
    if (!text) return;

    setSentMessages((current) => [
      ...current,
      { id: createChatMessageId(), type: "text", text },
    ]);
    setDraftMessage("");
  };

  const sendImageFiles = (files: FileList | null) => {
    const imageFiles = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      showNotice("لطفا فقط فایل تصویر انتخاب کنید");
      return;
    }

    const imageMessages = imageFiles.map((file) => {
      const imageUrl = URL.createObjectURL(file);
      imageObjectUrlsRef.current.push(imageUrl);

      return {
        id: createChatMessageId(),
        type: "image" as const,
        imageUrl,
        fileName: file.name || "تصویر ارسالی",
      };
    });

    setSentMessages((current) => [...current, ...imageMessages]);
  };

  const sendCurrentLocation = () => {
    if (isSendingLocation) return;

    setIsSendingLocation(true);
    showNotice("در حال دریافت موقعیت شما...");

    void getBrowserLocation({ maximumAge: 30_000, timeout: 15_000 })
      .then(({ latitude, longitude }) => {
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setSentMessages((current) => [
          ...current,
          {
            id: createChatMessageId(),
            type: "location",
            latitude,
            longitude,
            mapsUrl,
          },
        ]);
        showNotice("موقعیت ارسال شد");
      })
      .catch((error) => {
        showNotice(getBrowserLocationNotice(error));
      })
      .finally(() => {
        setIsSendingLocation(false);
      });
  };

  const handleSendFileSelect = (id: SendFileOption["id"]) => {
    setIsSendFileSheetOpen(false);

    if (id === "camera") {
      if (cameraInputRef.current) {
        cameraInputRef.current.value = "";
        cameraInputRef.current.click();
      }
      return;
    }

    if (id === "gallery") {
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
        galleryInputRef.current.click();
      }
      return;
    }

    if (id === "map") {
      sendCurrentLocation();
    }
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ChatDetailHeader onOpenMenu={() => setIsSettingsSheetOpen(true)} />
      <ChatPropertyStrip />

      <div className="relative min-h-0 flex-1 bg-white">
        <main
          ref={chatScrollRef}
          onScroll={updateScrollShadow}
          className="h-full overflow-y-auto bg-white px-2.5 pb-14 pt-3"
        >
          <AgencyResponseCard />

          <div className="mt-3 space-y-3">
            <ChatBubble direction="outgoing" wide>
              سلام{"\n"}قیمت این خونه ای که گذاشتین چقدر هست و اگر بخوام رهن و بیشتر کنم امکانش هست؟
            </ChatBubble>

            <ChatBubble direction="incoming" wide>
              سلام دوست عزیز{"\n"}قیمت و داخل آگهی گذاشتم و قیمت مناسبی هم هست{"\n"}رهن و اجاره قابل تبدیل هست
            </ChatBubble>

            <ChatDateChip />

            <ChatBubble direction="outgoing">خیلی ممنونم</ChatBubble>
            <ChatBubble direction="incoming">خواهش میکنم</ChatBubble>

            {sentMessages.map((sentMessage) => (
              <SentChatMessageBubble message={sentMessage} key={sentMessage.id} />
            ))}
          </div>
        </main>

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-white via-white/85 to-transparent transition-opacity duration-200 ${hasMoreMessagesBelow ? "opacity-100" : "opacity-0"
            }`}
        />
      </div>

      <input
        ref={cameraInputRef}
        accept="image/*"
        aria-hidden="true"
        capture="environment"
        className="sr-only"
        onChange={(event) => sendImageFiles(event.target.files)}
        tabIndex={-1}
        type="file"
      />
      <input
        ref={galleryInputRef}
        accept="image/*"
        aria-hidden="true"
        className="sr-only"
        multiple
        onChange={(event) => sendImageFiles(event.target.files)}
        tabIndex={-1}
        type="file"
      />

      <ChatComposer
        message={draftMessage}
        onChangeMessage={setDraftMessage}
        onOpenAttach={() => setIsSendFileSheetOpen(true)}
        onSend={() => sendMessage()}
      />
      <SendFileBottomSheet
        isOpen={isSendFileSheetOpen}
        onClose={() => setIsSendFileSheetOpen(false)}
        onSelect={handleSendFileSelect}
      />
      <ChatSettingsBottomSheet
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        onSelect={(title) => {
          showNotice(`${title} انتخاب شد`);
          setIsSettingsSheetOpen(false);
        }}
      />
      <DemoNotice className="bottom-20" message={message} />
    </PageFrame>
  );
}

export function UserChatHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [chatIndexes, setChatIndexes] = useState(() => chatItems.map((_, index) => index));
  const [selectedChatIndexes, setSelectedChatIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const { message, showNotice } = useDemoNotice();

  const handleMenuSelect = (id: string) => {
    setIsMenuOpen(false);

    if (id === "hours") {
      showNotice("ساعت پاسخگویی: شنبه تا چهارشنبه، ۸ صبح تا ۹ شب");
      return;
    }

    if (id === "settings") {
      showNotice("تنظیمات نمایشی گفتگو باز شد");
      return;
    }

    if (id === "bulk-delete") {
      setIsBulkDeleteMode(true);
      setSelectedChatIndexes(new Set());
    }
  };

  const toggleSelectedChat = (index: number) => {
    setSelectedChatIndexes((current) => {
      const next = new Set(current);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const visibleChatIndexes = chatIndexes.filter((index) => {
    const item = { ...chatItems[index], ...chatCardOverrides[index] };
    const normalizedQuery = query.trim();

    if (normalizedQuery && !`${item.userName} ${item.adTitle} ${item.message}`.includes(normalizedQuery)) {
      return false;
    }
    if (activeFilter === "خوانده نشده" && !item.badgeCount) return false;
    if (activeFilter === "پشتیبانی" && !item.isBlocked) return false;
    if (activeFilter === "آگهی‌های من" && item.adLabel !== "آگهی من") return false;
    if (activeFilter === "آگهی‌های دیگران" && item.adLabel === "آگهی من") return false;
    return true;
  });

  const deleteSelectedChats = () => {
    const count = selectedChatIndexes.size;
    setChatIndexes((current) => current.filter((index) => !selectedChatIndexes.has(index)));
    setSelectedChatIndexes(new Set());
    setIsBulkDeleteMode(false);
    showNotice(`${count} گفتگو حذف شد`);
  };

  return (
    <TopBarNavigationLayout
      activeKey="chat"
      contentClassName="bg-white"
      fixedAfterTopBar={
        <>
          {isSearchOpen ? (
            <div className="shrink-0 bg-[#f0f0f0] px-4 pb-2">
              <input
                autoFocus
                className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm text-[#1a1a1a] outline-none focus:border-[#0048c4]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجو در گفتگوها"
                type="search"
                value={query}
              />
            </div>
          ) : null}
          <FilterTabs
            activeFilter={activeFilter}
            onSelect={(filter) =>
              setActiveFilter((current) => (current === filter ? null : filter))
            }
          />
          {isBulkDeleteMode ? (
            <div className="flex h-12 shrink-0 items-center justify-between bg-white px-4 [direction:ltr]">
              <button
                className="text-sm font-medium text-[#4d4d4d]"
                onClick={() => {
                  setIsBulkDeleteMode(false);
                  setSelectedChatIndexes(new Set());
                }}
                type="button"
              >
                انصراف
              </button>
              <button
                className="rounded-lg bg-[#ee3623] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                disabled={selectedChatIndexes.size === 0}
                onClick={deleteSelectedChats}
                type="button"
              >
                حذف ({selectedChatIndexes.size})
              </button>
            </div>
          ) : null}
        </>
      }
      frameClassName="relative bg-[#cccccc] text-[#1a1a1a] [direction:rtl]"
      overlay={
        <ChatMenuBottomSheet
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSelect={handleMenuSelect}
        />
      }
      topBar={
        <ChatHeader
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenSearch={() => {
            setIsSearchOpen((current) => !current);
            setQuery("");
          }}
        />
      }
    >
      {visibleChatIndexes.map((index) => (
        <ChatCard
          index={index}
          isBulkDeleteMode={isBulkDeleteMode}
          isSelected={selectedChatIndexes.has(index)}
          item={chatItems[index]}
          key={index}
          onToggleSelected={() => toggleSelectedChat(index)}
        />
      ))}
      {visibleChatIndexes.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#808080]">گفتگویی یافت نشد</p>
      ) : null}
      <DemoNotice message={message} />
    </TopBarNavigationLayout>
  );
}
