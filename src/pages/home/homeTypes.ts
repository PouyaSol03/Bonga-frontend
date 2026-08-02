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
