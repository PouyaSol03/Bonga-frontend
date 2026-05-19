import { useState } from 'react'

import { BottomSheet } from '../../../components/BottomSheet'
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
    <BottomSheet
      ariaLabel={`انتخاب دسته‌بندی ${title}`}
      contentClassName="mt-8"
      heightClassName="max-h-[min(88dvh,560px)]"
      isOpen={isOpen}
      onBack={handleBack}
      onClose={closeSheet}
      title={title}
    >
        <div className="px-4">
          <label className="relative flex h-11 items-center rounded-xl border border-[#808080] bg-white min-[390px]:h-12">
            <input
              className="h-full w-full rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] min-[390px]:text-base min-[390px]:leading-6"
              type="search"
              placeholder="جستجو در دسته‌بندی‌ها"
              tabIndex={isOpen ? 0 : -1}
            />
            <span className="home-search-icon" aria-hidden="true" />
          </label>
        </div>

        <div className="pt-3 min-[390px]:pt-4">
          {options.map((option) => (
            <button
              className="flex h-12 w-full cursor-pointer items-center gap-3 border-b border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] [direction:ltr] last:border-b-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] min-[390px]:h-14 min-[390px]:text-base min-[390px]:leading-6"
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
    </BottomSheet>
  )
}
