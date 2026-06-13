import { apiRequest } from "./apiClient";

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
  status: boolean;
  data: CategoryItem[];
};

export async function getCategoryList() {
  const response = await apiRequest<CategoryListResponse>("/category/list", {
    authenticated: false,
  });

  return response.data;
}