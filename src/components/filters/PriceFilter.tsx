import { Pill } from '../ui/Pill'
import { useFilterStore } from '../../store/filterStore'
import { PRICE_LABELS } from '../../constants'

const PRICE_OPTIONS = [1, 2, 3, 4] as const

export function PriceFilter() {
  const { priceRange, togglePrice } = useFilterStore()

  return (
    <div className="flex items-center gap-2">
      {PRICE_OPTIONS.map((level) => (
        <Pill
          key={level}
          label={PRICE_LABELS[level]}
          active={priceRange.includes(level)}
          onClick={() => togglePrice(level)}
        />
      ))}
    </div>
  )
}
