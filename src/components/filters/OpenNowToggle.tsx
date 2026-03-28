import { Toggle } from '../ui/Toggle'
import { useFilterStore } from '../../store/filterStore'

export function OpenNowToggle() {
  const { openNow, setOpenNow } = useFilterStore()
  return <Toggle checked={openNow} onChange={setOpenNow} label="Open now only" />
}
