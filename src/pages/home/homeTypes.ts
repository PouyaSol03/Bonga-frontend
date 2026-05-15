export type QuickAction = {
  label: string
  icon: string
  options: CategoryOption[]
}

export type CategoryOption = {
  label: string
  children?: string[]
}

export type RecentSearch = {
  id: number
  title: string
  subtitle: string
  tags: string[]
}

export type SearchSuggestion = {
  id: number
  title: string
  subtitle?: string
  count: string
}

export type SavedSearch = {
  id: number
  title: string
  tags: string[]
}

export type CityOption = {
  name: string
  count: string
}