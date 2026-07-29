import { useState } from 'react'

import { BottomSheet } from '../../../components/BottomSheet'
import { ListItem } from '../../../components/ui/ListItem'
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
      isOpen={isOpen}
      onBack={handleBack}
      onClose={closeSheet}
      title={title}
      variant="actions"
    >
      <div className="">
        {options.map((option) => (
          <ListItem
            className="after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-[#F0F0F0] last:after:hidden min-[390px]:min-h-14"
            data-category-sheet-row={option.label}
            key={option.label}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => {
              if (option.children?.length) {
                setSelectedOption(option)
                return
              }

              closeSheet()
              onSelectCategory(option)
            }}
            title={option.label}
            leading={<LinearArrowLeft1 className='w-6 h-6 text-[#4D4D4D]'/>}
          >
          </ListItem>
        ))}
      </div>
    </BottomSheet>
  )
}
