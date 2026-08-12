import {
  Legend,
  Pie,
  Cell as PieCell,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { twMerge } from "tailwind-merge";
import type { PieSlice } from "~/utils/stats";

const PALETTE = [
  "#38bdf8",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#2dd4bf",
  "#818cf8",
  "#f87171",
  "#c084fc",
  "#94a3b8",
];

export function UsagePieCard({
  title,
  data,
  onSliceClick,
  className,
}: {
  title: string;
  data: PieSlice[];
  onSliceClick?: (key: string) => void;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "rounded-lg border border-slate-100/10 bg-slate-900 p-4",
        className,
      )}
    >
      <p className="font-medium mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            className={onSliceClick ? "cursor-pointer" : undefined}
            onClick={
              onSliceClick
                ? (entry) => onSliceClick((entry.payload as PieSlice).key)
                : undefined
            }
          >
            {data.map((entry, i) => (
              <PieCell
                key={entry.key}
                fill={entry.fill ?? PALETTE[i % PALETTE.length]}
              />
            ))}
          </Pie>
          {/* TODO: for the "colors" pie, use more appropriate slice colors */}
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid rgba(148,163,184,0.1)",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
            itemStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
