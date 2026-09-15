// src/components/checkout/PaymentMethod.js
"use client";

export default function PaymentMethod({ selectedMethod, onChange }) {
  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery (COD)",
      description: "Paguaj në dorëzim me para në dorë",
      icon: "💵",
      fee: 0,
    },
    {
      id: "bank",
      name: "Transfer Bankar",
      description: "Transfero në llogarinë tonë bankare",
      icon: "🏦",
      fee: 0,
      details: {
        bank: "Raiffeisen Bank",
        account: "AL40 2011 1100 0000 0000 1234 5678",
        swift: "RAIFAL22",
        beneficiary: "Perlë Jewellery Design SH.P.K.",
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-6">Metoda e Pagesës</h2>

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
                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {method.description}
                </p>

                {/* Bank Details */}
                {method.id === "bank" && selectedMethod === "bank" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                    <h4 className="font-semibold mb-2">Detajet e llogarisë:</h4>
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

                {/* COD Info */}
                {method.id === "cod" && selectedMethod === "cod" && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Paguaj kur të marrësh produktin. Nuk ka pagesë paraprake!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Të dhënat tuaja janë të sigurta dhe nuk ndahen me palë të treta.
        </p>
      </div>
    </div>
  );
}
