import { createElement } from "react";
import type { AccountIconName, IconComponent } from "./types";
import LinearRealestate from "../../../shared/icons/LinearRealestate";
import LinearSupport from "../../../shared/icons/LinearSupport";
import LinearBuilding from "../../../shared/icons/LinearBuilding";
import Dashboard from "../../../shared/icons/Dashboard";
import LinearUserConfirmation from "../../../shared/icons/LinearUserConfirmation";
import LinearLegal from "../../../shared/icons/LinearLegal";
import LinearLogin from "../../../shared/icons/LinearLogin";
import LinearDocument from "../../../shared/icons/LinearDocument";
import LinearAdd from "../../../shared/icons/LinearAdd";
import LinearRanking from "../../../shared/icons/LinearRanking";
import LinearDelete from "../../../shared/icons/LinearDelete";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import LinearWalletAdd from "../../../shared/icons/LinearWalletAdd";
import LinearComment from "../../../shared/icons/LinearComment";
import LinearTag from "../../../shared/icons/LinearTag";
import LinearRequest from "../../../shared/icons/LinearRequest";
import LinearEditUser from "../../../shared/icons/LinearEditUser";
import LinearViewOn from "../../../shared/icons/LinearViewOn";
import LinearBookmarkSolid from "../../../shared/icons/LinearBookmarkSolid";
import LinearWallet2 from "../../../shared/icons/LinearWallet2";
import LinearSetting2 from "../../../shared/icons/LinearSetting2";
import LinearInformation from "../../../shared/icons/LinearInformation";
import LinearLogout from "../../../shared/icons/LinearLogout";

export const accountIconMap: Record<AccountIconName, IconComponent> = {
  agency: LinearRealestate,
  headphone: LinearSupport,
  bookmark: LinearBookmarkSolid,
  building: LinearBuilding,
  dashboard: Dashboard,
  eye: LinearViewOn,
  identity: LinearUserConfirmation,
  info: LinearInformation,
  legal: LinearLegal,
  lock: LinearLogin,
  log_out: LinearLogout,
  message: LinearComment,
  note: LinearDocument,
  plus: LinearAdd,
  ranking: LinearRanking,
  request: LinearRequest,
  setting: LinearSetting2,
  tag: LinearTag,
  team: LinearEditUser,
  trash: LinearDelete,
  user: LinearUserSolid,
  wallet: LinearWallet2,
  "wallet-add": LinearWalletAdd,
};

export function AccountIcon({ className = "", name }: { className?: string; name: AccountIconName }) {
  const Icon = accountIconMap[name];
  return createElement(Icon, { "aria-hidden": "true", className });
}
