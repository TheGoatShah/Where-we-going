import { StarRating } from '../ui/StarRating'
import { useFilterStore } from '../../store/filterStore'

export function RatingFilter() {
  const { minRating, setMinRating } = useFilterStore()
  return <StarRating value={minRating} onChange={setMinRating} />
}
