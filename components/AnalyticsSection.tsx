"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  CountryApprovalDatum,
  VisaTypeResultDatum,
  WeeklySubmissionDatum,
} from "@/lib/analytics";

const CARD = "rounded-2xl border border-white/10 bg-card p-5 sm:p-6";
const AXIS = "#A1A1AA";
const GRID = "#27272A";

function EmptyChartState() {
  return (
    <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-background/40 text-sm text-zinc-500">
      Not enough data yet
    </div>
  );
}

export function AnalyticsSection({
  approvalByCountry,
  resultsByVisaType,
  weeklySubmissions,
  weeklyCaseCount,
}: {
  approvalByCountry: CountryApprovalDatum[];
  resultsByVisaType: VisaTypeResultDatum[];
  weeklySubmissions: WeeklySubmissionDatum[];
  weeklyCaseCount: number;
}) {
  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Analytics
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className={CARD}>
          <h3 className="text-base font-semibold text-white">Approval Rate by Country</h3>
          <p className="mt-1 text-xs text-zinc-500">Top 10 countries by case volume</p>
          <div className="mt-4 h-[280px]">
            {approvalByCountry.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={approvalByCountry} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: AXIS, fontSize: 12 }} />
                  <YAxis
                    dataKey="country"
                    type="category"
                    width={100}
                    tick={{ fill: AXIS, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ background: "#12121A", border: "1px solid #27272A" }}
                    cursor={{ fill: "rgba(56,189,248,0.08)" }}
                    formatter={(value: number) => [`${value}%`, "Approval"]}
                  />
                  <Bar dataKey="approvalRate" radius={[0, 6, 6, 0]}>
                    {approvalByCountry.map((entry) => (
                      <Cell key={entry.country} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className={CARD}>
          <h3 className="text-base font-semibold text-white">Results by Visa Type</h3>
          <p className="mt-1 text-xs text-zinc-500">Approved, rejected, and pending counts</p>
          <div className="mt-4 h-[280px]">
            {resultsByVisaType.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resultsByVisaType} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="visaType" tick={{ fill: AXIS, fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: AXIS, fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "#12121A", border: "1px solid #27272A" }}
                    cursor={{ fill: "rgba(56,189,248,0.08)" }}
                  />
                  <Legend wrapperStyle={{ color: AXIS, fontSize: 12 }} />
                  <Bar dataKey="approved" stackId="results" fill="#22C55E" />
                  <Bar dataKey="rejected" stackId="results" fill="#EF4444" />
                  <Bar dataKey="pending" stackId="results" fill="#EAB308" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>
      </div>

      <article className={CARD}>
        <h3 className="text-base font-semibold text-white">Submissions Over Time</h3>
        <p className="mt-1 text-xs text-zinc-500">Weekly submissions for the last 12 weeks</p>
        <div className="mt-4 h-[280px]">
          {weeklyCaseCount < 5 ? (
            <EmptyChartState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklySubmissions} margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="weekLabel" tick={{ fill: AXIS, fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: AXIS, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "#12121A", border: "1px solid #27272A" }}
                  cursor={{ stroke: "#38BDF8", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#38BDF8" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>
    </section>
  );
}
