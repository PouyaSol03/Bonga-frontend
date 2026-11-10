import { lazyNamed, type AppRoute } from "../types";

const BusinessCreationPage = lazyNamed(
  () => import("../../../features/account/routes/BusinessCreationPage"),
  "BusinessCreationPage",
);
const BusinessInfoPage = lazyNamed(
  () => import("../../../features/account/routes/BusinessInfoPage"),
  "BusinessInfoPage",
);
const AgencyBusinessCreationPage = lazyNamed(
  () => import("../../../features/account/routes/AgencyBusinessCreationPage"),
  "AgencyBusinessCreationPage",
);
const AgencyNeighborhoodSelectionPage = lazyNamed(
  () => import("../../../features/account/routes/AgencyNeighborhoodSelectionPage"),
  "AgencyNeighborhoodSelectionPage",
);
const IndependentConsultantBusinessCreationPage = lazyNamed(
  () => import("../../../features/account/routes/IndependentConsultantBusinessCreationPage"),
  "IndependentConsultantBusinessCreationPage",
);

export const accountBusinessRoutes: AppRoute[] = [
  {
    path: "/account/business/create",
    title: "انتخاب نوع کسب‌وکار",
    Component: BusinessCreationPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/info",
    title: "اطلاعات کسب و کار",
    Component: BusinessInfoPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/info",
    title: "اطلاعات کسب و کار",
    Component: BusinessInfoPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/agency",
    title: "اطلاعات آژانس املاک",
    Component: AgencyBusinessCreationPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/agency/neighborhood",
    title: "انتخاب محله",
    Component: AgencyNeighborhoodSelectionPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/agency/neighborhoods",
    title: "انتخاب محله",
    Component: AgencyNeighborhoodSelectionPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/consultant",
    title: "اطلاعات مشاور مستقل",
    Component: IndependentConsultantBusinessCreationPage,
    requiresAuth: true,
  },
];
