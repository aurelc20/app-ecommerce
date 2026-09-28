// src/components/admin/RichTextEditor.js
"use client";

import { Lightbulb } from "lucide-react";

export default function RichTextEditor({ value, onChange }) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full px-4 py-2 border border-sand rounded-lg focus:ring-2 focus:ring-wood/20 focus:border-wood focus:outline-none text-ink"
        placeholder="Përshkruaj Produktin..."
      />
      <p className="flex items-start gap-1.5 text-xs text-ink-soft mt-1">
        <Lightbulb className="h-3.5 w-3.5 shrink-0 translate-y-0.5" />
        Mund të përdorësh HTML të thjeshtë: &lt;b&gt;bold&lt;/b&gt;,
        &lt;i&gt;italic&lt;/i&gt;,
        &lt;ul&gt;&lt;li&gt;lista&lt;/li&gt;&lt;/ul&gt;
      </p>
    </div>
  );
}
