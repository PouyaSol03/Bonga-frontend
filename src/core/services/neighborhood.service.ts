import { publicApi } from "../api/api";

export type NeighborhoodDto = {
  _id?: string;
  city_id?: string;
  id?: string;
  lat?: number;
  lng?: number;
  name: string;
  polygon?: unknown;
  sub_neighbors?: unknown;
};

type NeighborhoodListResponse =
  | {
      data?: NeighborhoodDto[];
      status?: boolean;
    }
  | NeighborhoodDto[];

type NeighborhoodInfoResponse =
  | {
      data?: NeighborhoodDto | NeighborhoodDto[];
      neighborhood?: NeighborhoodDto;
      status?: boolean;
    }
  | NeighborhoodDto
  | NeighborhoodDto[];

export type NeighborhoodListParams = {
  cityId: string;
  page?: number;
  perPage?: number;
  q?: string;
};

export type NeighborhoodInfoWithLocParams = {
  cityId: string;
  lat: number;
  lng: number;
};

function normalizeNeighborhood(neighborhood: NeighborhoodDto): NeighborhoodDto {
  return {
    ...neighborhood,
    id: String(neighborhood.id ?? neighborhood._id ?? ""),
  };
}

function unwrapNeighborhoodList(response: NeighborhoodListResponse) {
  const data = Array.isArray(response) ? response : response.data ?? [];

  return data.map(normalizeNeighborhood).filter((item) => item.id && item.name);
}

function unwrapNeighborhoodInfo(response: NeighborhoodInfoResponse) {
  if (Array.isArray(response)) return response[0] ? normalizeNeighborhood(response[0]) : null;

  if (!response || typeof response !== "object") return null;

  if ("name" in response) return normalizeNeighborhood(response as NeighborhoodDto);

  const data = response.data;

  if (Array.isArray(data)) return data[0] ? normalizeNeighborhood(data[0]) : null;
  if (data && typeof data === "object") return normalizeNeighborhood(data as NeighborhoodDto);
  if (response.neighborhood) return normalizeNeighborhood(response.neighborhood);

  return null;
}

export async function getNeighborhoodList({
  cityId,
  page,
  perPage,
  q = "",
}: NeighborhoodListParams) {
  const response = await publicApi
    .get("public/neighborhood/list", {
      searchParams: {
        city_id: cityId,
        page,
        per_page: perPage,
        q,
      },
    })
    .json<NeighborhoodListResponse>();

  return unwrapNeighborhoodList(response);
}

export async function getNeighborhoodInfoWithLoc({
  cityId,
  lat,
  lng,
}: NeighborhoodInfoWithLocParams) {
  const response = await publicApi
    .post("public/neighborhood/infoWithLoc", {
      json: {
        city_id: cityId,
        lat,
        lng,
      },
    })
    .json<NeighborhoodInfoResponse>();

  return unwrapNeighborhoodInfo(response);
}
