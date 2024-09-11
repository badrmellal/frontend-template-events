import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DropdownProps {
  options: { label: string; value: string }[]
  selectedValue: string
  onChange: (value: string) => void
  placeholder?: string
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onChange, placeholder = 'Select an option' }) => {
  return (
    <Select onValueChange={onChange} value={selectedValue}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default Dropdown;