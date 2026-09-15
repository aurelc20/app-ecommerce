// src/components/admin/RichTextEditor.js
"use client";

export default function RichTextEditor({ value, onChange }) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        placeholder="Përshkruaj Produktin..."
      />
      <p className="text-xs text-gray-500 mt-1">
        💡 Mund të përdorësh HTML të thjeshtë: &lt;b&gt;bold&lt;/b&gt;,
        &lt;i&gt;italic&lt;/i&gt;,
        &lt;ul&gt;&lt;li&gt;lista&lt;/li&gt;&lt;/ul&gt;
      </p>
    </div>
  );
}
