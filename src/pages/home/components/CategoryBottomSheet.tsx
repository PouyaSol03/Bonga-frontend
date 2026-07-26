import { useState } from 'react'

import { BottomSheet } from '../../../components/BottomSheet'
import { quickActions } from '../homeData'
import type { CategoryOption, QuickAction } from '../homeTypes'
import LinearArrowLeft1 from '../../../components/(icons)/LinearArrowLeft1'

type CategoryBottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  onSelectCategory: (category?: CategoryOption | QuickAction) => void
  selectedCategory: QuickAction | null
}

function normalizeCategoryOption(option: CategoryOption | string): CategoryOption {
  return typeof option === 'string' ? { label: option } : option
}

export function CategoryBottomSheet({
  isOpen,
  onClose,
  onSelectCategory,
  selectedCategory,
}: CategoryBottomSheetProps) {
  const [selectedOption, setSelectedOption] = useState<CategoryOption | null>(null)

  const isDrilldown = selectedOption !== null
  const title = selectedOption?.label ?? selectedCategory?.label ?? 'فروش'

  const options = selectedOption
    ? selectedOption.children?.map(normalizeCategoryOption) ?? []
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
      contentClassName=""
      heightClassName="max-h-[min(88dvh,560px)]"
      isOpen={isOpen}
      onBack={handleBack}
      onClose={closeSheet}
      title={title}
    >
      <div className="">
        {options.map((option) => (
          <button
            className="
    relative flex w-full cursor-pointer items-center gap-3
    bg-white px-4 py-6 text-right text-base! font-normal leading-6
    text-[#1a1a1a] [direction:ltr]
    after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-[#F0F0F0]
    last:after:hidden
    focus-visible:outline-3 focus-visible:outline-inset
    focus-visible:outline-[#0048c440]
    min-[390px]:h-14
  "
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
              onSelectCategory(option)
            }}
          >
            <LinearArrowLeft1 className='w-6 h-6 text-[#4D4D4D]'/>
            <span className="min-w-0 flex-1 [direction:rtl]">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
