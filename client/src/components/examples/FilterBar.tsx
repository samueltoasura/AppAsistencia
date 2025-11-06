import FilterBar from '../FilterBar'

export default function FilterBarExample() {
  return (
    <FilterBar
      onFilter={(filters) => console.log("Filters:", filters)}
      onExport={() => console.log("Export triggered")}
    />
  )
}
