// src/components/checkout/PaymentMethod.js (update)
"use client";

import { AlertTriangle, Banknote, Wallet } from "lucide-react";

export default function PaymentMethod({
  selectedMethod,
  onChange,
  paymentMethodsConfig = {},
}) {
  const paymentMethods = [
    {
      id: "cod",
      name: paymentMethodsConfig.cod?.label || "Cash on Delivery (COD)",
      description: "Paguaj në dorëzim me para në dorë",
      icon: Wallet,
      enabled: paymentMethodsConfig.cod?.enabled ?? true,
    },
    {
      id: "bank",
      name: paymentMethodsConfig.bank?.label || "Transfer Bankar",
      description: "Transfero në llogarinë tonë bankare",
      icon: Banknote,
      enabled: paymentMethodsConfig.bank?.enabled ?? true,
      details: {
        bank: paymentMethodsConfig.bank?.bankName || "",
        account: paymentMethodsConfig.bank?.accountNumber || "",
        swift: paymentMethodsConfig.bank?.swift || "",
        beneficiary: paymentMethodsConfig.bank?.beneficiary || "",
      },
    },
  ].filter((method) => method.enabled); // ✅ Shfaq vetëm metodat aktive

  return (
    <div className="rounded-2xl border border-sand bg-paper p-6">
      <h2 className="mb-6 font-display text-xl font-semibold text-ink">
        Metoda e Pagesës
      </h2>

      {paymentMethods.length === 0 ? (
        <p className="text-sm text-red-600">
          Nuk ka metoda pagese të disponueshme aktualisht. Na kontaktoni.
        </p>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <div
                key={method.id}
                onClick={() => onChange(method.id)}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-wood bg-wood/5"
                    : "border-sand hover:border-wood/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={isSelected}
                    onChange={() => onChange(method.id)}
                    className="mt-1 accent-wood"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-wood" />
                      <h3 className="font-semibold text-ink">{method.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">
                      {method.description}
                    </p>

                    {method.id === "bank" && selectedMethod === "bank" && (
                      <div className="mt-4 rounded-lg bg-sand/50 p-4 text-sm">
                        <h4 className="mb-2 font-semibold text-ink">
                          Detajet e llogarisë:
                        </h4>
                        <div className="space-y-1 text-ink-soft">
                          <p>
                            <span className="font-medium text-ink">
                              Banka:
                            </span>{" "}
                            {method.details.bank}
                          </p>
                          <p>
                            <span className="font-medium text-ink">
                              IBAN:
                            </span>{" "}
                            <span className="font-mono">
                              {method.details.account}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-ink">
                              SWIFT:
                            </span>{" "}
                            {method.details.swift}
                          </p>
                          <p>
                            <span className="font-medium text-ink">
                              Përfituesi:
                            </span>{" "}
                            {method.details.beneficiary}
                          </p>
                        </div>
                        <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-soft">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          Pas krijimit të porosisë, dërgo dëshminë e pagesës në
                          email-in tonë.
                        </p>
                      </div>
                    )}

                    {method.id === "cod" && selectedMethod === "cod" && (
                      <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                        Paguaj kur të marrësh produktin. Nuk ka pagesë
                        paraprake!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
