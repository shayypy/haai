import { useCallback, useEffect, useState } from "react";
import { getStoredDataset, putStoredDataset } from "../utils/storage";
import type { TableRow } from "../utils/types";

type DatasetState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; rows: TableRow[] }
  | { status: "error"; message: string };

async function fetchDataset(): Promise<{ rows: TableRow[]; hash: string }> {
  const [dataRes, hashRes] = await Promise.all([
    fetch("/data.json"),
    fetch("/hash.txt"),
  ]);
  if (!dataRes.ok || !hashRes.ok) {
    throw new Error("Failed to fetch dataset");
  }
  const [rows, hash] = await Promise.all([
    dataRes.json() as Promise<TableRow[]>,
    hashRes.text(),
  ]);
  return { rows, hash: hash.trim() };
}

export function useDataset() {
  const [state, setState] = useState<DatasetState>({ status: "idle" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const { rows, hash } = await fetchDataset();
      await putStoredDataset(rows, hash);
      setState({ status: "ready", rows });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load data",
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await getStoredDataset();
      if (cancelled) return;

      if (!stored) {
        setState({ status: "idle" });
        return;
      }

      setState({ status: "ready", rows: stored.rows });

      // only refetch if the hash has changed
      try {
        const hashRes = await fetch("/hash.txt");
        if (!hashRes.ok || cancelled) return;
        const hash = (await hashRes.text()).trim();
        if (cancelled || hash === stored.hash) return;

        const dataRes = await fetch("/data.json");
        if (!dataRes.ok || cancelled) return;
        const rows = (await dataRes.json()) as TableRow[];
        if (cancelled) return;

        await putStoredDataset(rows, hash);
        if (!cancelled) setState({ status: "ready", rows });
      } catch {
        // user or site must be offline
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...state, load };
}
