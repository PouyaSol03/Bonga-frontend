export type QuickAction = {
  code?: string
  formCode?: string
  id?: string
  label: string
  icon: string
  options: CategoryOption[]
}

export type CategoryOption = {
  code?: string
  formCode?: string
  id?: string
  label: string
  children?: Array<CategoryOption | string>
}

export type CityOption = {
  name: string
  count: string
}

export type RecentSearch = {
  id: number
  title: string
  subtitle: string
  tags: string[]
}

export type SavedSearch = {
  id: number
  title: string
  tags: string[]
}

export type SearchSuggestion = {
  id: number
  title: string
  subtitle: string
  count: string
}
