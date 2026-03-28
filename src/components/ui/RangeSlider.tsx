interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
}

export function RangeSlider({
  min,
  max,
  step = 0.5,
  value,
  onChange,
  formatValue,
}: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="relative w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full cursor-pointer focus:outline-none"
        style={{
          background: `linear-gradient(to right, var(--color-primary-hex) ${pct}%, var(--slider-track) ${pct}%)`,
        }}
        aria-label={`Distance: ${formatValue ? formatValue(value) : value}`}
      />
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-primary-hex);
          cursor: pointer;
          box-shadow: 0 0 8px var(--color-primary-glow);
          border: 2px solid white;
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-primary-hex);
          cursor: pointer;
          box-shadow: 0 0 8px var(--color-primary-glow);
          border: 2px solid white;
        }
      `}</style>
    </div>
  )
}
