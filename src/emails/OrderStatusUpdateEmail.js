// src/emails/OrderStatusUpdateEmail.js
export function orderStatusUpdateTemplate({ order, user, newStatus }) {
  const statusMessages = {
    processing: {
      icon: "⚙️",
      title: "Porosia jote është në përpunim",
      color: "#3b82f6",
    },
    shipped: { icon: "📦", title: "Porosia jote u dërgua!", color: "#8b5cf6" },
    out_for_delivery: {
      icon: "🚚",
      title: "Porosia jote është në rrugë",
      color: "#6366f1",
    },
    delivered: {
      icon: "✅",
      title: "Porosia jote u dorëzua!",
      color: "#10b981",
    },
    cancelled: { icon: "❌", title: "Porosia jote u anulua", color: "#ef4444" },
  };

  const statusInfo = statusMessages[newStatus] || statusMessages.processing;

  return `
  <!DOCTYPE html>
  <html lang="sq">
  <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="500" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="background-color: ${statusInfo.color}; padding: 32px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">${statusInfo.icon}</div>
                <h1 style="color: #ffffff; margin: 0; font-size: 22px;">${statusInfo.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px; text-align: center;">
                <p style="color: #6b7280; font-size: 15px; margin: 0 0 24px;">
                  Përshëndetje ${user.name}, statusi i porosisë #${order._id.toString().slice(-8).toUpperCase()} u përditësua.
                </p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/orders/${order._id}" 
                   style="display: inline-block; background-color: #9333ea; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                  Shiko Porosinë
                </a>
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
