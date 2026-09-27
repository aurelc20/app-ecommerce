// src/components/Modal.js
"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children, maxWidth = "max-w-sm" }) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-ink/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full ${maxWidth} rounded-2xl border border-sand bg-paper p-6 shadow-2xl`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
