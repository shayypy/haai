import { useEffect, useRef, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import type { ViewState } from "~/hooks/use-view-state";
import {
  breedNames,
  colorNames,
  horseTypeNames,
  tagDescriptions,
  tagNames,
} from "~/utils/flags";
import {
  copyText,
  getServerName,
  getServerRegions,
  regionToEmoji,
  regionToEmojiCode,
  serverDomains,
  serverNames,
  twemojiUrl,
} from "~/utils/text";
import type { ParsedRow } from "../utils/rows";
import { selectClass } from "./filter-bar";

const Field = ({
  label,
  children,
}: { label: string } & React.PropsWithChildren) => (
  <div className="py-1.5 border-b border-slate-100/10 last:border-0">
    <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
    <dd className="mt-0.5">{children}</dd>
  </div>
);

const formatDate = (date?: Date) =>
  date ? (
    date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  ) : (
    <Dash />
  );

const ServerWithFlag = ({ region }: { region: string }) => (
  <span>
    <img
      src={twemojiUrl(regionToEmojiCode(region))}
      alt={region}
      className="h-6 inline me-1 align-bottom"
    />
    {getServerName(region)}
  </span>
);

const Dash = () => <span className="italic text-gray-400">-</span>;

function ThumbnailInfo({ imageUrl }: { imageUrl: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="absolute left-1 top-1 z-10 group" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Low resolution thumbnail"
        className="flex size-5 items-center justify-center rounded-full bg-slate-900/80 text-gray-200 hover:text-white transition-colors cursor-pointer"
      >
        <FaCircleInfo className="h-3.5 w-3.5" />
      </button>

      {!open && (
        <div className="pointer-events-none absolute left-0 top-full mt-1 hidden whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-gray-200 shadow-lg group-hover:block">
          Low resolution
        </div>
      )}

      {open && (
        <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-slate-100/10 bg-slate-800 p-2 text-xs shadow-lg">
          <p className="text-gray-300">
            HAAI serves half-resolution thumbnails for browsing and wishes to
            respect the rights holders by not duplicating images in full.
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Wikipedia:Non-free_content/Definition_of_%22low_resolution%22"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-blue-400 hover:underline"
          >
            Read more
          </a>{" "}
          •{" "}
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-blue-400 hover:underline"
          >
            Open original
          </a>
        </div>
      )}
    </div>
  );
}

export function RowModal({
  row,
  update,
  onClose,
}: {
  row: ParsedRow | undefined;
  onClose: () => void;
  update: (
    partial: Partial<ViewState>,
    opts?: { resetPage?: boolean; replace?: boolean },
  ) => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled globally above; this is a mouse-only backdrop dismiss
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close, not itself a control
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: only prevents the backdrop's onClose from firing; Escape is handled globally above */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={row?.name ?? "Entry details"}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg border border-slate-100/10 bg-slate-900 p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="font-semibold text-lg">{row?.name ?? "Not found"}</p>
          <div className="flex gap-2">
            {row ? (
              <button
                type="button"
                onClick={async (e) => {
                  const { currentTarget } = e;
                  const copied = await copyText(`${origin}/?row=${row.id}`);
                  if (copied) {
                    currentTarget.innerText = "Copied";
                  } else {
                    currentTarget.innerText = "Failed";
                  }
                }}
                className="rounded-lg border border-slate-100/10 bg-slate-800 px-2 py-1 text-sm hover:bg-slate-700 transition-colors"
              >
                Copy Permalink
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-100/10 bg-slate-800 px-2 py-1 text-sm hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {row ? (
          <dl className="mt-3">
            <div className="flex gap-4">
              <div className="shrink-0 w-1/3 relative">
                <a href={row.image_url} target="_blank" rel="noreferrer">
                  <img
                    src={row.thumbnail_url ?? row.image_url}
                    alt=""
                    className="bg-slate-700 rounded-lg p-0.5 w-full"
                  />
                </a>
                {row.thumbnail_url ? (
                  <ThumbnailInfo imageUrl={row.image_url} />
                ) : null}
              </div>
              <div className="grow">
                <Field label="Author">
                  <button
                    type="button"
                    className="inline hover:underline"
                    onClick={() => {
                      update(
                        { author: row.author, row: null },
                        { resetPage: true },
                      );
                    }}
                  >
                    {row.author}
                  </button>
                </Field>
                <Field label="Server">
                  {row.server ? (
                    <ServerWithFlag region={row.server} />
                  ) : (
                    <Dash />
                  )}
                </Field>
                <Field label="Open in">
                  <div className="flex gap-2 items-center">
                    <select
                      className={selectClass}
                      onChange={(e) => {
                        window.open(
                          `https://${e.target.value}/marche/noir/object?qName=pomme-or&creation=${row.id}`,
                          "_blank",
                        );
                        e.target.value = "";
                      }}
                    >
                      <option value="">Select a server</option>
                      {Object.entries(serverDomains).map(([region, domain]) => (
                        <option key={region} value={domain}>
                          {regionToEmoji(region)} {/* @ts-expect-error */}
                          {serverNames[region] ?? region} (
                          {domain.replace(/www\./, "")})
                        </option>
                      ))}
                    </select>
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex border-b border-slate-100/10">
              <div className="grow">
                <Field label="Horse type">
                  {horseTypeNames[row.horse_type] ?? row.horse_type}
                </Field>
              </div>
              <div className="grow">
                <Field label="Breed ref">
                  {row.breed_ref ? (
                    (breedNames[row.breed_ref] ?? row.breed_ref)
                  ) : (
                    <Dash />
                  )}
                </Field>
              </div>
            </div>
            <Field label="Colors">
              {row.colors.length === 0 ? (
                <Dash />
              ) : (
                row.colors.map((color, i) => (
                  <div key={color} className="contents">
                    {i === 0 ? "" : ", "}
                    <button
                      type="button"
                      className="inline hover:underline"
                      onClick={() => {
                        update(
                          { colors: [color], row: null },
                          { resetPage: true },
                        );
                      }}
                    >
                      {/* @ts-expect-error */}
                      {colorNames[color] ?? color}
                    </button>
                  </div>
                ))
              )}
            </Field>
            <Field label="Tags">
              {row.tags.length === 0 ? (
                <Dash />
              ) : (
                row.tags.map((tag, i) => (
                  <div key={tag} className="contents">
                    {i === 0 ? "" : ", "}
                    <button
                      type="button"
                      className="inline hover:underline"
                      onClick={() => {
                        update({ tags: [tag], row: null }, { resetPage: true });
                      }}
                    >
                      {/* @ts-expect-error */}
                      {tagNames[tag] ?? tag}
                    </button>
                  </div>
                ))
              )}
            </Field>
            <div className="flex border-b border-slate-100/10">
              <div className="grow">
                <Field label="Retired Apple">
                  {row.retired ? "Yes" : "No"}
                </Field>
              </div>
              <div className="grow">
                <Field label="Retired in">
                  {row.retired_in ? (
                    <div className="flex flex-row gap-2">
                      {getServerRegions(row.retired_in).map((region) => (
                        <ServerWithFlag key={region} region={region} />
                      ))}
                    </div>
                  ) : (
                    <Dash />
                  )}
                </Field>
              </div>
            </div>
            <Field label="Helios Ray">{row.helios_ray ? "Yes" : "No"}</Field>
            <Field label="Max. Uses">{row.uses ?? <Dash />}</Field>
            <div className="flex border-b border-slate-100/10">
              <div className="grow">
                <Field label="Uploaded">{formatDate(row.uploaded)}</Field>
              </div>
              <div className="grow">
                <Field label="Archived">{formatDate(row.archived)}</Field>
              </div>
            </div>
            <Field label="ID">{row.id}</Field>
            {row.tags.length !== 0 ? (
              <div className="mt-3 rounded-lg bg-slate-800 border border-slate-100/10 px-2.5 py-1.5">
                <p className="text-sm font-medium">Tag Definitions</p>
                <ul className="text-sm space-y-1 mt-1">
                  {row.tags.map((tag) => {
                    const desc = tagDescriptions.find((d) => d.tag === tag);
                    return (
                      <li key={tag} className="border-t border-slate-100/20 pt-1">
                        <span className="font-semibold">
                          {/* @ts-expect-error */}
                          {tagNames[tag] ?? tag}:{" "}
                        </span>
                        {desc ? (
                          <>
                            <span>{desc.description}</span>
                            <span className="text-gray-400">
                              {" "}
                              ({desc.group})
                            </span>
                          </>
                        ) : (
                          <span className="italic text-gray-400">
                            No description available
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="mt-3 text-gray-400">
            This entry couldn't be found in the loaded dataset.
          </p>
        )}
      </div>
    </div>
  );
}
