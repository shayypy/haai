import { Link } from "react-router";
import { tagDescriptions, tagNames } from "~/utils/flags";
import { Cell } from "./home";

const tagsByGroup = Object.fromEntries(
  tagDescriptions
    .map((t) => t.group)
    .filter((g, i, a) => a.indexOf(g) === i)
    .map((group) => {
      const tags = tagDescriptions.filter((t) => t.group === group);
      return [group, tags];
    }),
);

export function TagsPage() {
  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-xl">
              HAAI <span className="ms-2 text-gray-400">Tag Definitions</span>
            </p>
            <p className="text-gray-200 mt-1">
              Also available in individual apple cards.
            </p>
          </div>
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-200 hover:underline"
          >
            Back to table
          </Link>
        </div>
        {Object.entries(tagsByGroup).map(([group, descs]) => (
          <div key={group} className="mt-2">
            <p className="text-lg font-medium">{group}</p>
            <div className="mt-0 rounded-lg bg-slate-900 border-2 border-slate-100/10 overflow-y-hidden overflow-x-auto flex flex-col gap-0.5">
              {descs.map((desc) => (
                <div key={desc.tag} className="flex gap-0.5">
                  <Cell title>
                    <Link
                      to={`/?tags=${desc.tag}`}
                      className="block cursor-default hover:underline underline-offset-2 w-full"
                    >
                      {/* @ts-expect-error */}
                      {tagNames[desc.tag] ?? desc.tag}
                    </Link>
                  </Cell>
                  <Cell width="100%">{desc.description}</Cell>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
