import { publicApi } from "../../../shared/api/api";

export type CategoryItem = {
  id: string;
  name: string;
  parent_id: string | null;
  code: string;
  priority: number;
  priority_on_first_page: number;
  slug: string;
  slug_of_first_page: string;
  track_code: number;
  children: CategoryItem[];
};

type CategoryListResponse = {
  data: CategoryItem[];
  status: boolean;
};

export async function getCategoryList() {
  const response = await publicApi
    .get("public/category/list")
    .json<CategoryListResponse>();

  return response.data;
}
