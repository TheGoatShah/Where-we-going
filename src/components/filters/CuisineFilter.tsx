import { Pill } from '../ui/Pill'
import { useFilterStore } from '../../store/filterStore'
import { CUISINES } from '../../constants'

export function CuisineFilter() {
  const { cuisines, toggleCuisine } = useFilterStore()

  return (
    <div className="flex flex-wrap gap-2">
      {CUISINES.map((cuisine) => (
        <Pill
          key={cuisine}
          label={cuisine}
          active={cuisines.includes(cuisine)}
          onClick={() => toggleCuisine(cuisine)}
        />
      ))}
    </div>
  )
}
