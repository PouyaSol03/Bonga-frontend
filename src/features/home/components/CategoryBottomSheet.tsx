import { useState } from 'react'

import { BottomSheet } from '../../../shared/components/BottomSheet'
import { Button } from '../../../shared/ui/Button'
import { Typography } from '../../../shared/ui/Typography'
import type { CategoryOption, QuickAction } from '../homeTypes'
import LinearArrowLeft1 from '../../../shared/icons/LinearArrowLeft1'
import LinearArrowRight2 from '../../../shared/icons/LinearArrowRight2'

type CategoryBottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  onSelectCategory: (category?: CategoryOption | QuickAction) => void
  selectedCategory: QuickAction | null
}

function normalizeCategoryOption(option: CategoryOption | string): CategoryOption {
  return typeof option === 'string' ? { label: option } : option
}

const transactionCategoryLabels = new Set(['فروش', 'اجاره', 'پروژه'])

function getRootOptionLabel(label: string, parentLabel?: string) {
  if (!parentLabel) return label

  const normalizedLabel = label.trim()
  const normalizedParentLabel = parentLabel.trim()

  if (!transactionCategoryLabels.has(normalizedParentLabel)) return normalizedLabel
  if (!normalizedLabel.startsWith(normalizedParentLabel)) return normalizedLabel

  return normalizedLabel.slice(normalizedParentLabel.length).trim() || normalizedLabel
}

function getDrilldownTitle(optionLabel: string, parentLabel?: string) {
  if (!parentLabel) return optionLabel

  const normalizedOptionLabel = optionLabel.trim()
  const normalizedParentLabel = parentLabel.trim()

  if (!transactionCategoryLabels.has(normalizedParentLabel)) return normalizedOptionLabel
  if (normalizedOptionLabel.startsWith(normalizedParentLabel)) {
    return normalizedOptionLabel
  }

  return `${normalizedParentLabel} ${normalizedOptionLabel}`.trim()
}

export function CategoryBottomSheet({
  isOpen,
  onClose,
  onSelectCategory,
  selectedCategory,
}: CategoryBottomSheetProps) {
  const [selectedOption, setSelectedOption] = useState<CategoryOption | null>(null)

  const isDrilldown = selectedOption !== null
  const title = selectedOption
    ? getDrilldownTitle(selectedOption.label, selectedCategory?.label)
    : selectedCategory?.label ?? 'فروش'

  const options = selectedOption
    ? selectedOption.children?.map(normalizeCategoryOption) ?? []
    : selectedCategory?.options ?? []

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
      className="rounded-t-[24px]!"
      contentClassName="pt-1"
      isOpen={isOpen}
      onClose={closeSheet}
      panelPaddingClassName="pt-4 pb-4"
      showHeader={false}
      variant="actions"
    >
      <header className="flex h-10 items-center gap-1 px-2">
        <Button
          unstyled
          aria-label="بازگشت"
          className="grid h-10 w-10 shrink-0 place-items-center bg-transparent text-[#4D4D4D] outline-none focus:bg-transparent focus:outline-none focus-visible:bg-transparent focus-visible:outline-none active:bg-transparent"
          onClick={handleBack}
          type="button"
        >
          <LinearArrowRight2 className="h-6 w-6" />
        </Button>

        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 min-w-0 flex-1 text-right text-[#1A1A1A]"
        >
          {title}
        </Typography>
      </header>

      <div>
        {options.map((option, index) => {
          const displayLabel = isDrilldown
            ? option.label
            : getRootOptionLabel(option.label, selectedCategory?.label)

          return (
            <div className="relative" key={option.label}>
              <Button
                unstyled
                className="flex h-[72px] w-full items-center gap-3 bg-white px-4 text-right outline-none focus:outline-none focus-visible:outline-none"
                data-category-sheet-row={option.label}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => {
                  if (option.children?.length) {
                    setSelectedOption(option)
                    return
                  }

                  closeSheet()
                  onSelectCategory(option)
                }}
                type="button"
              >
                <Typography
                  as="span"
                  variant="body"
                  size="large"
                  weight="regular"
                  className="min-w-0 flex-1 text-right text-[#1A1A1A] [direction:rtl]"
                >
                  {displayLabel}
                </Typography>

                <span className="grid h-6 w-6 shrink-0 place-items-center text-[#4D4D4D]">
                  <LinearArrowLeft1 className="h-6 w-6" />
                </span>
              </Button>

              {index < options.length - 1 ? (
                <div className="absolute inset-x-4 bottom-0 h-px bg-[#F0F0F0]" />
              ) : null}
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}
