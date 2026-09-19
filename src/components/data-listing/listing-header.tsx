import { Search } from "lucide-react";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

type Filter = {
  key: string;
  label: string;
  value: string;
  onChange: (value: string | undefined) => void;
  options: { value: string; label: string }[];
};

type ListingHeaderProps = {
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  filters: Filter[];
};

/**
 * Reusable header component for data listings.
 * Handles search and filter controls.
 * Responsive layout that works on mobile and desktop.
 */
export function ListingHeader({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filters,
}: ListingHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pr-9"
          aria-label="جستجو"
        />
      </div>

      {/* Filters */}
      {filters.map((filter) => (
        <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="w-full sm:w-40" aria-label={filter.label}>
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
