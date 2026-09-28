// src/components/ConfirmModal.js
"use client";

import { TriangleAlert, X } from "lucide-react";
import Modal from "@/components/Modal";

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Konfirmo",
  cancelLabel = "Anulo",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-wood">
          <TriangleAlert className="h-5 w-5" />
        </div>
        <button
          onClick={onCancel}
          className="rounded-full p-1.5 text-ink-soft transition hover:bg-sand/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <h2 className="mt-4 font-display text-lg font-semibold text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-ink-soft">{description}</p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-full border border-sand py-2.5 text-sm font-medium text-ink transition hover:bg-sand/60"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-full bg-ink py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
