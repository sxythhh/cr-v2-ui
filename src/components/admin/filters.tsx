// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { CentralIcon } from "@central-icons-react/all";

const ciProps = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

/* ── Types ── */

export interface FilterOption {
  value: string;
  label: string;
  icon?: ReactNode;
  hideLabel?: boolean;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: "text" | "select" | "multiselect";
  icon?: ReactNode;
  placeholder?: string;
  options?: FilterOption[];
  searchable?: boolean;
  group?: string;
}

export interface Filter {
  field: string;
  operator: string;
  value: string | string[];
}

export function createFilter(field: string, operator: string, value: string | string[]): Filter {
  return { field, operator, value };
}

/* ── Operators per type ── */
const OPERATORS: Record<string, { value: string; label: string }[]> = {
  text: [
    { value: "contains", label: "contains" },
    { value: "not_contains", label: "does not contain" },
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
  ],
  select: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
  ],
  multiselect: [
    { value: "is_any_of", label: "is any of" },
    { value: "is_none_of", label: "is none of" },
  ],
};

/* ── Shared dropdown wrapper ── */
function DropdownPanel({ children, style, className }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={`absolute z-50 overflow-hidden ${className ?? ""}`}
      style={{
        background: "var(--dropdown-bg)",
        border: "1px solid var(--dropdown-border)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "var(--dropdown-shadow)",
        borderRadius: 10,
        padding: 0,
        maxWidth: "calc(100vw - 32px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Checkbox ── */
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: 16, height: 16 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: checked ? "var(--dropdown-checkbox-checked)" : "var(--dropdown-checkbox-bg)",
          borderRadius: 4,
        }}
      />
      {!checked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.01)",
            boxShadow: "inset 0px 0px 0px 1px var(--dropdown-checkbox-border)",
            borderRadius: 4,
          }}
        />
      )}
      {checked && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute inset-0">
          <path d="M4 8.5L6.5 11L12 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* ── Main Filters component ── */

interface FiltersProps {
  filters: Filter[];
  fields: FilterFieldConfig[];
  onChange: (filters: Filter[]) => void;
}

export function Filters({ filters, fields, onChange }: FiltersProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  // Keyboard shortcut "f"
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return;
      if (e.key === "f" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPickerOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const addFilter = useCallback((fieldKey: string) => {
    const field = fields.find((f) => f.key === fieldKey);
    if (!field) return;
    const defaultOp = OPERATORS[field.type]?.[0]?.value ?? "is";
    const defaultVal = field.type === "multiselect" ? [] : "";
    const newFilter = createFilter(fieldKey, defaultOp, defaultVal);
    const newFilters = [...filters, newFilter];
    onChange(newFilters);
    setPickerOpen(false);
    setEditingIndex(newFilters.length - 1);
  }, [fields, filters, onChange]);

  const removeFilter = useCallback((index: number) => {
    onChange(filters.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  }, [filters, onChange, editingIndex]);

  const updateFilter = useCallback((index: number, updates: Partial<Filter>) => {
    onChange(filters.map((f, i) => i === index ? { ...f, ...updates } : f));
  }, [filters, onChange]);

  // Group fields
  const groups = new Map<string, FilterFieldConfig[]>();
  for (const f of fields) {
    const g = f.group ?? "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(f);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap min-w-0">
      {/* Active filter pills */}
      {filters.map((filter, i) => {
        const field = fields.find((f) => f.key === filter.field);
        if (!field) return null;
        return (
          <FilterPill
            key={`${filter.field}-${i}`}
            filter={filter}
            field={field}
            fields={fields}
            isEditing={editingIndex === i}
            onEdit={() => setEditingIndex(editingIndex === i ? null : i)}
            onRemove={() => removeFilter(i)}
            onUpdate={(updates) => updateFilter(i, updates)}
          />
        );
      })}

      {/* Add filter button */}
      <div ref={pickerRef} className="relative">
        <button
          onClick={() => { setPickerOpen((o) => !o); setEditingIndex(null); }}
          className="flex items-center gap-1.5 rounded-full px-3 cursor-pointer min-h-[44px] sm:min-h-0"
          style={{
            height: 30,
            border: "1px dashed #484848",
            background: "transparent",
            color: "#B4B4B4",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <CentralIcon name="IconFilter1" size={14} color="#B4B4B4" {...ciProps} />
          Add Filter
          <kbd className="ml-1 rounded bg-[rgba(255,255,255,0.06)] px-1 py-0.5 text-[10px] font-mono text-[var(--muted-fg)]">F</kbd>
        </button>

        {pickerOpen && (
          <DropdownPanel
            className="left-0 top-[calc(100%+6px)]"
            style={{ width: 220, maxHeight: 320 }}
          >
            <div className="overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {Array.from(groups.entries()).map(([groupName, groupFields]) => (
                <div key={groupName}>
                  {groupName && (
                    <div className="px-3.5 py-1.5" style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-fg)", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                      {groupName}
                    </div>
                  )}
                  {groupFields.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => addFilter(f.key)}
                      className="flex w-full items-center gap-2.5 transition-colors hover:bg-[var(--dropdown-item-hover)]"
                      style={{ padding: "5px 14px", fontSize: 14, fontWeight: 500, color: "var(--dropdown-text)" }}
                    >
                      {f.icon && <span className="flex shrink-0 items-center justify-center" style={{ width: 16, height: 16 }}>{f.icon}</span>}
                      {f.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </DropdownPanel>
        )}
      </div>

      {/* Clear all */}
      {filters.length > 0 && (
        <button
          onClick={() => { onChange([]); setEditingIndex(null); }}
          className="flex items-center gap-1.5 rounded-full px-2.5 cursor-pointer"
          style={{
            height: 30,
            border: "1px solid var(--border-color)",
            background: "transparent",
            color: "var(--muted-fg)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M6 6L0.750001 11.25M6 6L0.75 0.75M6 6L11.25 0.75M6 6L11.25 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}

/* ── Filter Pill ── */

function FilterPill({
  filter,
  field,
  fields,
  isEditing,
  onEdit,
  onRemove,
  onUpdate,
}: {
  filter: Filter;
  field: FilterFieldConfig;
  fields: FilterFieldConfig[];
  isEditing: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onUpdate: (updates: Partial<Filter>) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onEdit();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isEditing, onEdit]);

  // Format display value
  const displayValue = (() => {
    if (Array.isArray(filter.value)) {
      if (filter.value.length === 0) return "...";
      const labels = filter.value.map((v) => field.options?.find((o) => o.value === v)?.label ?? v);
      return labels.length <= 2 ? labels.join(", ") : `${labels.length} selected`;
    }
    if (!filter.value) return "...";
    return field.options?.find((o) => o.value === filter.value)?.label ?? filter.value;
  })();

  const operatorLabel = OPERATORS[field.type]?.find((o) => o.value === filter.operator)?.label ?? filter.operator;

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center gap-0 rounded-full cursor-pointer overflow-hidden"
        style={{
          height: 30,
          border: isEditing ? "1px solid #f6850f" : "1px solid var(--border-color)",
          background: "var(--accent)",
        }}
      >
        {/* Field + operator + value */}
        <button
          onClick={onEdit}
          className="flex items-center gap-1 pl-2.5 pr-1 h-full"
          style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-fg)" }}
        >
          {field.icon && <span className="flex shrink-0" style={{ width: 14, height: 14 }}>{field.icon}</span>}
          {field.label}
          <span style={{ color: "var(--fg)", fontWeight: 400 }}>{operatorLabel}</span>
          <span style={{ fontWeight: 600, color: "var(--fg)" }}>{displayValue}</span>
        </button>

        {/* Remove */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="flex items-center justify-center h-full pl-1.5 pr-2.5 hover:bg-[var(--dropdown-item-hover)]"
          style={{ borderLeft: "1px solid var(--border-color)" }}
        >
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
            <path d="M6 6L0.750001 11.25M6 6L0.75 0.75M6 6L11.25 0.75M6 6L11.25 11.25" stroke="var(--muted-fg)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Editing dropdown */}
      {isEditing && (
        <FilterEditor
          filter={filter}
          field={field}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

/* ── Filter Editor (value picker dropdown) ── */

function FilterEditor({
  filter,
  field,
  onUpdate,
}: {
  filter: Filter;
  field: FilterFieldConfig;
  onUpdate: (updates: Partial<Filter>) => void;
}) {
  const [search, setSearch] = useState("");
  const ops = OPERATORS[field.type] ?? [];

  const filteredOptions = (field.options ?? []).filter((o) =>
    !search || o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (val: string) => {
    if (field.type === "multiselect") {
      const current = Array.isArray(filter.value) ? filter.value : [];
      const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      onUpdate({ value: next });
    } else {
      onUpdate({ value: val });
    }
  };

  return (
    <DropdownPanel
      className="left-0 top-[calc(100%+6px)]"
      style={{ width: 260, maxHeight: 360 }}
    >
      {/* Operator selector */}
      <div className="flex items-center gap-1 px-2 py-1.5" style={{ borderBottom: "1px solid var(--border-color)" }}>
        {ops.map((op) => (
          <button
            key={op.value}
            onClick={() => onUpdate({ operator: op.value })}
            className="rounded-md px-2 py-0.5 transition-colors"
            style={{
              fontSize: 12,
              fontWeight: 500,
              background: filter.operator === op.value ? "var(--dropdown-item-active)" : "transparent",
              color: filter.operator === op.value ? "var(--fg)" : "var(--muted-fg)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Text input for text type */}
      {field.type === "text" && (
        <div className="p-2">
          <input
            autoFocus
            value={typeof filter.value === "string" ? filter.value : ""}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder={field.placeholder ?? "Enter value..."}
            className="w-full rounded-md bg-transparent px-2.5 py-1.5 text-[13px] outline-none"
            style={{
              border: "1px solid var(--border-color)",
              color: "var(--fg)",
            }}
          />
        </div>
      )}

      {/* Options for select / multiselect */}
      {(field.type === "select" || field.type === "multiselect") && (
        <>
          {field.searchable && (
            <div className="flex items-center gap-2 px-3.5 py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <CentralIcon name="IconMagnifyingGlass" size={12} color="var(--muted-fg)" {...ciProps} />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-[13px] outline-none"
                style={{ color: "var(--fg)" }}
              />
            </div>
          )}

          <div className="overflow-y-auto" style={{ maxHeight: 240, scrollbarWidth: "none" }}>
            {filteredOptions.map((opt) => {
              const selected = field.type === "multiselect"
                ? (Array.isArray(filter.value) && filter.value.includes(opt.value))
                : filter.value === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => toggleValue(opt.value)}
                  className="flex w-full items-center gap-2.5 transition-colors hover:bg-[var(--dropdown-item-hover)]"
                  style={{ padding: "5px 14px", fontSize: 14, fontWeight: 400, color: "var(--dropdown-text)" }}
                >
                  {field.type === "multiselect" && <Checkbox checked={selected} />}
                  {opt.icon && <span className="flex shrink-0 items-center justify-center">{opt.icon}</span>}
                  {!opt.hideLabel && <span className="truncate">{opt.label}</span>}
                  {field.type === "select" && selected && (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="ml-auto shrink-0">
                      <path d="M4 8.5L6.5 11L12 5.5" stroke="#f6850f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
            {filteredOptions.length === 0 && (
              <div className="px-3.5 py-3 text-center" style={{ fontSize: 13, color: "var(--muted-fg)" }}>
                No results
              </div>
            )}
          </div>
        </>
      )}
    </DropdownPanel>
  );
}
