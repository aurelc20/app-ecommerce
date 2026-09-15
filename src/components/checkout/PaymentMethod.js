// src/components/checkout/PaymentMethod.js (update)
"use client";

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
      icon: "💵",
      enabled: paymentMethodsConfig.cod?.enabled ?? true,
    },
    {
      id: "bank",
      name: paymentMethodsConfig.bank?.label || "Transfer Bankar",
      description: "Transfero në llogarinë tonë bankare",
      icon: "🏦",
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
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-6">Metoda e Pagesës</h2>

      {paymentMethods.length === 0 ? (
        <p className="text-red-600 text-sm">
          Nuk ka metoda pagese të disponueshme aktualisht. Na kontaktoni.
        </p>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedMethod === method.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === method.id}
                  onChange={() => onChange(method.id)}
                  className="mt-1"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{method.icon}</span>
                    <h3 className="font-semibold text-gray-900">
                      {method.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {method.description}
                  </p>

                  {method.id === "bank" && selectedMethod === "bank" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                      <h4 className="font-semibold mb-2">
                        Detajet e llogarisë:
                      </h4>
                      <div className="space-y-1 text-gray-700">
                        <p>
                          <span className="font-medium">Banka:</span>{" "}
                          {method.details.bank}
                        </p>
                        <p>
                          <span className="font-medium">IBAN:</span>{" "}
                          <span className="font-mono">
                            {method.details.account}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">SWIFT:</span>{" "}
                          {method.details.swift}
                        </p>
                        <p>
                          <span className="font-medium">Përfituesi:</span>{" "}
                          {method.details.beneficiary}
                        </p>
                      </div>
                      <p className="mt-3 text-xs text-gray-500">
                        ⚠️ Pas krijimit të porosisë, dërgo dëshminë e pagesës në
                        email-in tonë.
                      </p>
                    </div>
                  )}

                  {method.id === "cod" && selectedMethod === "cod" && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                      Paguaj kur të marrësh produktin. Nuk ka pagesë paraprake!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
