import React from "react";
import { ChevronLeft, ChevronRight, Filter, ListFilter, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";
import { SearchInput, Select, Toolbar } from "./toolbar";

export interface CollectionOption {
  value: string;
  label: string;
}

export interface CollectionFilter {
  id: string;
  label: string;
  value: string;
  options: CollectionOption[];
  onChange: (value: string) => void;
}

interface CollectionToolbarProps {
  search?: { value: string; onChange: (value: string) => void; placeholder: string };
  filters?: CollectionFilter[];
  sort?: { value: string; options: CollectionOption[]; onChange: (value: string) => void };
  groupBy?: { value: string; options: CollectionOption[]; onChange: (value: string) => void };
  onClear?: () => void;
  hasActiveControls?: boolean;
  className?: string;
}

/** A consistent search, filter, sort and group-by bar for collection views. */
export function CollectionToolbar({
  search,
  filters = [],
  sort,
  groupBy,
  onClear,
  hasActiveControls = false,
  className,
}: CollectionToolbarProps) {
  return (
    <Toolbar className={cn("flex-wrap", className)}>
      {search && (
        <SearchInput
          value={search.value}
          onChange={(event) => search.onChange(event.target.value)}
          placeholder={search.placeholder}
          aria-label={search.placeholder}
        />
      )}
      {filters.map((filter) => (
        <Select
          key={filter.id}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          icon={Filter}
          aria-label={`Filter by ${filter.label}`}
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ))}
      {sort && (
        <Select
          value={sort.value}
          onChange={(event) => sort.onChange(event.target.value)}
          icon={ListFilter}
          aria-label="Sort results"
        >
          {sort.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
      {groupBy && (
        <Select
          value={groupBy.value}
          onChange={(event) => groupBy.onChange(event.target.value)}
          icon={ListFilter}
          aria-label="Group results"
        >
          {groupBy.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
      {hasActiveControls && onClear && (
        <Button variant="ghost" size="sm" icon={X} onClick={onClear}>
          Clear filters
        </Button>
      )}
    </Toolbar>
  );
}

interface CollectionPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

/** Accessible page navigation with a count and page-size selector. */
export function CollectionPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: CollectionPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-t border-app-border px-4 py-3", className)}>
      <p className="text-caption text-app-muted" aria-live="polite">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-caption text-app-muted">
          Rows
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-md border border-app-border bg-app-surface px-2 py-1 text-caption text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <Button variant="ghost" size="sm" icon={ChevronLeft} aria-label="Previous page" disabled={safePage <= 1} onClick={() => onPageChange(safePage - 1)} />
        <span className="min-w-20 text-center text-caption text-app-muted">Page {safePage} of {totalPages}</span>
        <Button variant="ghost" size="sm" icon={ChevronRight} aria-label="Next page" disabled={safePage >= totalPages} onClick={() => onPageChange(safePage + 1)} />
      </div>
    </div>
  );
}
