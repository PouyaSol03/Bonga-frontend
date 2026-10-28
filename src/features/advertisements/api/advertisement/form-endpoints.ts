import { ApiError, publicApi } from "../../../../shared/api/api";
import { unwrapAdvertiseFormDefinition } from "./form-response";

export async function getAdvertiseFormDefinition(formCode: string) {
  const normalizedCode = formCode.trim();
  if (!normalizedCode) throw new ApiError(400, "کد فرم آگهی مشخص نیست.");

  const response = await publicApi
    .get(`public/advertise-form/${encodeURIComponent(normalizedCode)}`)
    .json<unknown>();

  return unwrapAdvertiseFormDefinition(response, normalizedCode);
}
