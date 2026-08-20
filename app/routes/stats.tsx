import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LeaderboardCard } from "~/components/stats/leaderboard-card";
import { UsagePieCard } from "~/components/stats/usage-pie-card";
import { serializeViewState, type ViewState } from "~/hooks/use-view-state";
import {
  colorColors,
  colorNames,
  tagDescriptions,
  tagNames,
} from "~/utils/flags";
import {
  sortedNewestAuthors,
  sortedProlificAuthors,
  sortedServers,
} from "~/utils/stats";
import { getServerName, regionToEmoji } from "~/utils/text";
import type { StatsFile } from "~/utils/types";

const BAR_WIDTH = 36;

const tagGroups = tagDescriptions
  .map((d) => d.group)
  .filter((g, i, a) => a.indexOf(g) === i);

export default function StatsPage() {
  const [stats, setStats] = useState<StatsFile>();
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    if (stats || error) return;
    fetch("/stats.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load stats");
        return res.json();
      })
      .then(setStats)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load stats"),
      );
  }, [stats, error]);

  const colorData = useMemo(
    () =>
      stats
        ? Object.entries(stats.usage.colors).map(([color, value]) => ({
            key: color,
            value,
            // @ts-expect-error
            label: colorNames[color] ?? color,
            // @ts-expect-error
            fill: colorColors[color],
          }))
        : [],
    [stats],
  );
  const serverData = useMemo(
    () => (stats ? sortedServers(stats.usage.servers) : {}),
    [stats],
  );
  const newestAuthors = useMemo(
    () => (stats ? sortedNewestAuthors(stats.newest_authors) : []),
    [stats],
  );
  const prolificAuthors = useMemo(
    () => (stats ? sortedProlificAuthors(stats.prolific_authors) : []),
    [stats],
  );

  const [timeGraph, setTimeGraph] = useState<"year" | number>("year");
  const timeGraphData = useMemo(() => {
    if (stats) {
      if (timeGraph === "year") {
        const years: { year: number; label: string; apples: number }[] = [];
        for (const month of stats.months) {
          const extant = years.find((y) => y.year === month.year);
          if (extant) extant.apples += month.apples;
          else {
            years.push({
              label: String(month.year),
              year: month.year,
              apples: month.apples,
            });
          }
        }
        years.sort((a, b) => a.year - b.year);
        return years;
      } else {
        return new Array(12).fill(null).map((_, i) => ({
          month: i,
          year: timeGraph,
          label: new Date(timeGraph, i).toLocaleString(undefined, {
            month: "long",
          }),
          apples:
            stats.months.find((m) => m.month === i && m.year === timeGraph)
              ?.apples ?? 0,
        }));
      }
    }
    return [];
  }, [stats, timeGraph]);

  const goFiltered = (partial: Partial<ViewState>) => {
    navigate(`/?${serializeViewState(partial).toString()}`);
  };

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-xl">
            HAAI <span className="text-gray-400 ms-2">Statistics</span>
          </p>
          <p className="text-gray-100 text-sm">
            Statistics are updated along with new data pushes. As this is
            currently an incomplete index, this page represents only the
            statistics for our actual archived data, and may show biases due to
            how it is gathered.
          </p>
        </div>
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-gray-200 hover:underline shrink-0"
        >
          Back to table
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-6">
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : !stats ? (
          <p className="text-gray-400">Loading stats…</p>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UsagePieCard
                title="Colors"
                data={colorData}
                onSliceClick={(key) => goFiltered({ colors: [key] })}
              />
              <LeaderboardCard
                title="Servers"
                rows={Object.entries(serverData).map(([region, apples]) => ({
                  name: `${regionToEmoji(region)} ${getServerName(region)}`,
                  apples,
                  query: { server: region },
                }))}
              />
            </div>

            <div className="flex gap-4 flex-nowrap overflow-x-auto">
              {tagGroups.map((group) => (
                <UsagePieCard
                  key={group}
                  title={`Tags - ${group}`}
                  className="min-w-1/3 grow"
                  data={tagDescriptions
                    .filter((d) => d.group === group)
                    .map((d) => ({
                      key: d.tag,
                      // @ts-expect-error
                      label: tagNames[d.tag] ?? d.tag,
                      value: stats.usage.tags[d.tag] ?? 0,
                      fill:
                        group === "Color"
                          ? {
                              bay: colorColors.n,
                              black: colorColors.b,
                              red: colorColors.r,
                              cream: colorColors.w,
                              cfan: colorColors.u,
                              gray: colorColors.g,
                              pinto: "#f97316",
                              roan: "#0ea5e9",
                              seal: "#1d4ed8",
                            }[d.tag]
                          : undefined,
                    }))}
                  onSliceClick={(key) => {
                    goFiltered({ tags: [key] });
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <LeaderboardCard
                title="Newest authors"
                rows={newestAuthors.map((a) => ({
                  ...a,
                  group: new Date(a.first_seen).toLocaleString(undefined, {
                    month: "long",
                    year: "numeric",
                  }),
                  rank: new Date(a.first_seen).getDate(),
                }))}
              />
              <LeaderboardCard
                title="Most prolific authors"
                rows={prolificAuthors}
              />
            </div>

            <div className="rounded-lg border border-slate-100/10 bg-slate-900 p-4">
              <div className="flex mb-2 items-start gap-2">
                <p className="font-medium">
                  Uploads over time
                  {typeof timeGraph === "number" ? ` (${timeGraph})` : ""}
                </p>
                {typeof timeGraph === "number" ? (
                  <button
                    type="button"
                    onClick={() => setTimeGraph("year")}
                    className="text-gray-400 ms-auto text-sm hover:underline cursor-pointer"
                  >
                    Back to years
                  </button>
                ) : null}
              </div>
              <div className="overflow-x-auto">
                <ResponsiveContainer
                  width={Math.max(600, timeGraphData.length * BAR_WIDTH)}
                  height={320}
                >
                  <BarChart data={timeGraphData} margin={{ bottom: 60 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148,163,184,0.1)"
                    />
                    <XAxis
                      dataKey="label"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid rgba(148,163,184,0.1)",
                        borderRadius: 8,
                        color: "#e2e8f0",
                      }}
                      itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Bar
                      dataKey="apples"
                      fill="#38bdf8"
                      className="cursor-pointer"
                      onClick={(e) => {
                        if ("year" in e && !("month" in e)) {
                          setTimeGraph(e.year as number);
                        } else if ("month" in e) {
                          const m = ((e.month as number) + 1)
                            .toString()
                            .padStart(2, "0");
                          goFiltered({
                            uploaded_from: `${timeGraph}-${m}`,
                            uploaded_to: `${timeGraph}-${m}`,
                          });
                        }
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
