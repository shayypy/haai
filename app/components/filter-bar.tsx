import { GrClear } from "react-icons/gr";
import { twMerge } from "tailwind-merge";
import {
  breedNames,
  colorNames,
  horseTypeNames,
  type MaxUses,
  maxUses,
  tagNames,
} from "~/utils/flags";
import { getServerName, regionToEmoji, serverDomains } from "~/utils/text";
import type { SortField, TriState, ViewState } from "../hooks/use-view-state";
import { PAGE_SIZES } from "../hooks/use-view-state";
import { MultiSelect } from "./multi-select";

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "author", label: "Author" },
  { value: "id", label: "ID" },
  { value: "uploaded", label: "Uploaded" },
  { value: "archived", label: "Archived" },
];

export const selectClass =
  "rounded-lg border border-slate-100/10 bg-slate-800 px-2 py-1.5 text-sm hover:bg-slate-700 transition-colors outline-none";

const colorOptions = Object.entries(colorNames).map(([value, label]) => ({
  value,
  label,
}));

const tagOptions = Object.entries(tagNames).map(([value, label]) => ({
  value,
  label,
}));

const horseTypeOptions = Object.entries(horseTypeNames).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

const breedOptions = Object.entries(breedNames).map(([value, label]) => ({
  value,
  label,
}));

export function FilterBar({
  view,
  update,
  total,
}: {
  view: ViewState;
  update: (
    partial: Partial<ViewState>,
    opts?: { resetPage?: boolean; replace?: boolean; retain?: boolean },
  ) => void;
  total: number;
}) {
  const start = total === 0 ? 0 : (view.page - 1) * view.limit + 1;
  const end = Math.min(view.page * view.limit, total);
  const totalPages = Math.max(1, Math.ceil(total / view.limit));

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-gray-400">
        {start}-{end} of {total.toLocaleString()}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <input
          type="text"
          value={view.q}
          onChange={(e) => update({ q: e.target.value }, { resetPage: true })}
          placeholder="Search name / author…"
          className={twMerge(selectClass, "w-40")}
        />
        <button
          type="button"
          className={twMerge(selectClass, "cursor-pointer")}
          onClick={() =>
            update(
              { layout: view.layout },
              { resetPage: true, replace: true, retain: false },
            )
          }
        >
          <GrClear className="text-lg" />
        </button>

        <select
          value={view.layout ?? "table"}
          onChange={(e) =>
            update(
              { layout: e.target.value === "gallery" ? "gallery" : "table" },
              { resetPage: false },
            )
          }
          className={selectClass}
        >
          <option value="table">View: Table</option>
          <option value="gallery">View: Gallery</option>
        </select>

        <select
          value={view.server ?? ""}
          onChange={(e) =>
            update({ server: e.target.value || null }, { resetPage: true })
          }
          className={selectClass}
        >
          <option value="">All servers</option>
          {Object.keys(serverDomains).map((s) => (
            <option key={s} value={s}>
              {regionToEmoji(s)} {getServerName(s)}
            </option>
          ))}
        </select>

        <select
          value={String(view.uses ?? "")}
          onChange={(e) =>
            update(
              {
                uses:
                  e.target.value === ""
                    ? null
                    : (Number(e.target.value) as MaxUses),
              },
              { resetPage: true },
            )
          }
          className={selectClass}
        >
          <option value="">Uses: Any</option>
          {maxUses.map((num) => (
            <option key={num} value={num}>
              Uses: {num}
            </option>
          ))}
        </select>

        <select
          value={view.retired}
          onChange={(e) =>
            update({ retired: e.target.value as TriState }, { resetPage: true })
          }
          className={selectClass}
        >
          <option value="any">Retired Apple: Any</option>
          <option value="yes">Retired Apple: Yes</option>
          <option value="no">Retired Apple: No</option>
        </select>

        <select
          value={view.helios}
          onChange={(e) =>
            update({ helios: e.target.value as TriState }, { resetPage: true })
          }
          className={selectClass}
        >
          <option value="any">Helios: Any</option>
          <option value="yes">Helios: Yes</option>
          <option value="no">Helios: No</option>
        </select>

        <select
          value={view.horse_type ?? ""}
          onChange={(e) =>
            update(
              { horse_type: e.target.value as string },
              { resetPage: true },
            )
          }
          className={selectClass}
        >
          <option value="">Horse Type: Any</option>
          {horseTypeOptions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={view.breed_ref ?? ""}
          onChange={(e) =>
            update({ breed_ref: e.target.value as string }, { resetPage: true })
          }
          className={selectClass}
        >
          <option value="">Breed Ref: Any</option>
          {breedOptions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <MultiSelect
          label="Colors"
          options={colorOptions}
          selected={view.colors}
          onChange={(colors) => update({ colors }, { resetPage: true })}
        />

        <MultiSelect
          label="Tags"
          options={tagOptions}
          selected={view.tags}
          onChange={(tags) => update({ tags }, { resetPage: true })}
        />

        <select
          value={view.sort ?? ""}
          onChange={(e) =>
            update(
              { sort: (e.target.value || null) as SortField | null },
              { resetPage: true },
            )
          }
          className={selectClass}
        >
          <option value="">Unsorted</option>
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              Sort: {s.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!view.sort}
          onClick={() =>
            update(
              { dir: view.dir === "asc" ? "desc" : "asc" },
              { resetPage: true },
            )
          }
          className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
          title="Toggle sort direction"
        >
          {view.dir === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>

        <select
          value={view.limit}
          onChange={(e) =>
            update(
              { limit: Number(e.target.value) as ViewState["limit"] },
              { resetPage: true },
            )
          }
          className={selectClass}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={view.page <= 1}
            onClick={() => update({ page: view.page - 1 })}
            className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-400 px-1">
            {view.page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={view.page >= totalPages}
            onClick={() => update({ page: view.page + 1 })}
            className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
