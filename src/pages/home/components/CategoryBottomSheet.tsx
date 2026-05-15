import { useState } from 'react'

import { quickActions } from '../homeData'
import type { CategoryOption, QuickAction } from '../homeTypes'

type CategoryBottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  selectedCategory: QuickAction | null
}

export function CategoryBottomSheet({
  isOpen,
  onClose,
  selectedCategory,
}: CategoryBottomSheetProps) {
  const [selectedOption, setSelectedOption] = useState<CategoryOption | null>(null)

  const isDrilldown = selectedOption !== null
  const title = selectedOption?.label ?? selectedCategory?.label ?? 'فروش'

  const options = selectedOption
    ? selectedOption.children?.map((label): CategoryOption => ({ label })) ?? []
    : selectedCategory?.options ?? quickActions[0].options

  const closeSheet = () => {
    setSelectedOption(null)
    onClose()
  }

  const handleBack = () => {
    if (isDrilldown) {
      setSelectedOption(null)
      return
    }

    closeSheet()
  }

  return (
    <div
      className={`absolute inset-0 z-50 flex items-end overflow-hidden transition-[opacity,visibility] duration-200 ease-out ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      aria-hidden={!isOpen}
    >
      <button
        className="absolute inset-0 cursor-default bg-black/60"
        type="button"
        aria-label="بستن دسته‌بندی‌ها"
        tabIndex={isOpen ? 0 : -1}
        onClick={closeSheet}
      />

      <section
        className={`relative z-10 w-full rounded-t-3xl bg-white pb-4 pt-4 shadow-[0_-16px_32px_rgba(26,26,26,0.16)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={`انتخاب دسته‌بندی ${title}`}
      >
        <span className="mx-auto block h-1 w-14 rounded-full bg-[#cccccc]" aria-hidden="true" />

        <div className="flex h-12 items-center gap-3 px-4 pt-4">
          <button
            className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]"
            type="button"
            aria-label={isDrilldown ? 'بازگشت' : 'بستن'}
            onClick={handleBack}
          >
            <span className="category-sheet-back-icon" aria-hidden="true" />
          </button>

          <h2 className="m-0 min-w-0 flex-1 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
            {title}
          </h2>
        </div>

        <div className="px-4 pt-4">
          <label className="relative flex h-12 items-center rounded-xl border border-[#808080] bg-white">
            <input
              className="h-full w-full rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-4 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#808080]"
              type="search"
              placeholder="جستجو در دسته‌بندی‌ها"
              tabIndex={isOpen ? 0 : -1}
            />
            <span className="home-search-icon" aria-hidden="true" />
          </label>
        </div>

        <div className="pt-4">
          {options.map((option) => (
            <button
              className="flex h-14 w-full cursor-pointer items-center gap-3 border-b border-[#cccccc] bg-white px-4 text-right text-base font-normal leading-6 text-[#1a1a1a] [direction:ltr] last:border-b-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
              data-category-sheet-row={option.label}
              key={option.label}
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => {
                if (option.children?.length) {
                  setSelectedOption(option)
                  return
                }

                closeSheet()
              }}
            >
              <span className="category-sheet-row-icon" aria-hidden="true" />
              <span className="min-w-0 flex-1 [direction:rtl]">{option.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}