// src/emails/OrderConfirmationEmail.js
export function orderConfirmationTemplate({ order, user }) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${
              item.image
                ? `<img src="${item.image}" width="50" height="50" style="border-radius: 8px; object-fit: cover;" alt="${item.name}" />`
                : ""
            }
            <span style="font-weight: 500; color: #1f2937;">${item.name}</span>
          </div>
        </td>
        <td style="padding: 12px 0; text-align: center; color: #6b7280;">
          x${item.quantity}
        </td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `,
    )
    .join("");

  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on Delivery (COD)"
      : order.paymentMethod === "bank"
        ? "Transfer Bankar"
        : order.paymentMethod;

  return `
  <!DOCTYPE html>
  <html lang="sq">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #9333ea, #ec4899); padding: 40px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Furniture Shop</h1>
                <p style="color: #f3e8ff; margin: 8px 0 0; font-size: 14px;">Faleminderit për porositë tuaj!</p>
              </td>
            </tr>

            <!-- Success Icon -->
            <tr>
              <td style="padding: 32px 32px 0; text-align: center;">
                <div style="width: 64px; height: 64px; background-color: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  <span style="font-size: 32px;">✅</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 8px; font-size: 22px;">Porosia u konfirmua!</h2>
                <p style="color: #6b7280; margin: 0; font-size: 15px;">
                  Përshëndetje ${user.name}, porosia jote #${order._id.toString().slice(-8).toUpperCase()} u pranua me sukses.
                </p>
              </td>
            </tr>

            <!-- Order Items -->
            <tr>
              <td style="padding: 24px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                      <th style="text-align: left; padding: 8px 0; font-size: 13px; color: #9ca3af; text-transform: uppercase;">Produkti</th>
                      <th style="text-align: center; padding: 8px 0; font-size: 13px; color: #9ca3af; text-transform: uppercase;">Sasia</th>
                      <th style="text-align: right; padding: 8px 0; font-size: 13px; color: #9ca3af; text-transform: uppercase;">Totali</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Order Summary -->
            <tr>
              <td style="padding: 0 32px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                  <tr>
                    <td style="padding: 6px 16px; color: #6b7280; font-size: 14px;">Subtotal</td>
                    <td style="padding: 6px 16px; text-align: right; color: #1f2937; font-size: 14px;">$${order.itemsPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 16px; color: #6b7280; font-size: 14px;">Transporti</td>
                    <td style="padding: 6px 16px; text-align: right; color: #1f2937; font-size: 14px;">${order.shippingPrice === 0 ? "Falas" : "$" + order.shippingPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 16px; color: #6b7280; font-size: 14px;">Tatimi</td>
                    <td style="padding: 6px 16px; text-align: right; color: #1f2937; font-size: 14px;">$${order.taxPrice.toFixed(2)}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e5e7eb;">
                    <td style="padding: 12px 16px 6px; color: #1f2937; font-size: 16px; font-weight: 700;">Total</td>
                    <td style="padding: 12px 16px 6px; text-align: right; color: #9333ea; font-size: 18px; font-weight: 700;">$${order.totalPrice.toFixed(2)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Shipping & Payment Info -->
            <tr>
              <td style="padding: 0 32px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 12px;">
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                        <h3 style="margin: 0 0 8px; font-size: 13px; color: #9ca3af; text-transform: uppercase;">📍 Adresa e Dërgesës</h3>
                        <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.5;">
                          ${order.shippingAddress.fullName}<br/>
                          ${order.shippingAddress.street}<br/>
                          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br/>
                          ${order.shippingAddress.country}<br/>
                          📞 ${order.shippingAddress.phone}
                        </p>
                      </div>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 12px;">
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                        <h3 style="margin: 0 0 8px; font-size: 13px; color: #9ca3af; text-transform: uppercase;">💳 Pagesa</h3>
                        <p style="margin: 0; color: #1f2937; font-size: 14px;">
                          ${paymentLabel}
                        </p>
                        ${
                          order.paymentMethod === "cod"
                            ? '<p style="margin: 8px 0 0; color: #059669; font-size: 13px;">Paguaj kur të marrësh produktin</p>'
                            : ""
                        }
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA Button -->
            <tr>
              <td style="padding: 0 32px 32px; text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard/orders/${order._id}" 
                   style="display: inline-block; background-color: #9333ea; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                  Shiko Detajet e Porosisë
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                  Ke pyetje? Na kontakto në <a href="mailto:info@perle.com" style="color: #9333ea;">info@perle.com</a>
                </p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © 2026 Furniture Shop. Durrës, Shqipëri.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
