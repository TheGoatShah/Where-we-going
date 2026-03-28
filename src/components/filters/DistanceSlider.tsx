import { RangeSlider } from '../ui/RangeSlider'
import { useFilterStore } from '../../store/filterStore'
import { DISTANCE_MIN, DISTANCE_MAX } from '../../constants'

export function DistanceSlider() {
  const { maxDistance, setMaxDistance } = useFilterStore()

  return (
    <div className="flex items-center gap-4">
      <RangeSlider
        min={DISTANCE_MIN}
        max={DISTANCE_MAX}
        step={0.5}
        value={maxDistance}
        onChange={setMaxDistance}
      />
      <span className="text-sm font-semibold text-primary whitespace-nowrap min-w-[64px] text-right">
        {maxDistance} mi
      </span>
    </div>
  )
}
