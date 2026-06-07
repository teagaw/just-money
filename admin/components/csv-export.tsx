"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "./button";

export function CsvExport({
  data,
  filename,
  headers,
}: {
  data: Record<string, string | number>[];
  filename: string;
  headers: { key: string; label: string }[];
}) {
  const [busy, setBusy] = useState(false);
  const exportCsv = () => {
    setBusy(true);
    try {
      const rows = [
        headers.map((h) => csvEscape(h.label)).join(","),
        ...data.map((row) =>
          headers.map((h) => csvEscape(String(row[h.key] ?? ""))).join(",")
        ),
      ];
      const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setBusy(false), 200);
    }
  };
  return (
    <Button variant="secondary" size="sm" onClick={exportCsv} disabled={busy}>
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </Button>
  );
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
