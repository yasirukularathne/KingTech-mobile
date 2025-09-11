import * as React from "react";

// Basic types matching what the action selects
interface ProductInfo {
  id: string;
  name: string;
  imagePath?: string | null;
  description?: string | null;
}

interface OrderInfo {
  id: string;
  createdAt: Date | string;
  pricePaidInCents: number;
  downloadVerificationId?: string;
  pricePaidInCentsLKR?: string; // optionally preformatted
  product: ProductInfo;
}

interface Props {
  orders: OrderInfo[];
}

// Simple currency fallback if preformatted version not provided
function formatLKR(cents: number) {
  try {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(cents / 100);
  } catch {
    return `LKR ${(cents / 100).toFixed(2)}`;
  }
}

const rowStyle: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
};

const cellStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 14,
  lineHeight: 1.4,
  verticalAlign: "top",
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 600,
  background: "#f8fafc",
};

const wrapperStyle: React.CSSProperties = {
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  background: "#f1f5f9",
  padding: 24,
  color: "#0f172a",
};

const panelStyle: React.CSSProperties = {
  maxWidth: 640,
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16,
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 700,
};

const smallText: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  marginTop: 4,
};

const footerStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  marginTop: 24,
  textAlign: "center" as const,
};

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const placeholderImg = "https://via.placeholder.com/64x64.png?text=IMG";

export default function OrderHistoryEmail({ orders }: Props) {
  return (
    <div style={wrapperStyle}>
      <div style={panelStyle}>
        <h1 style={headingStyle}>Your Order History</h1>
        <p style={smallText}>
          Below is a summary of your purchased products. Download links (where
          applicable) are valid for a limited time.
        </p>
        <table
          style={tableStyle}
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
        >
          <thead>
            <tr style={rowStyle}>
              <th style={headerCellStyle}>Product</th>
              <th style={headerCellStyle}>Date</th>
              <th style={headerCellStyle}>Amount</th>
              <th style={headerCellStyle}>Download</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const displayPrice =
                o.pricePaidInCentsLKR || formatLKR(o.pricePaidInCents);
              const imageSrc = o.product.imagePath || placeholderImg;
              const downloadLink = o.downloadVerificationId
                ? `${
                    process.env.NEXT_PUBLIC_BASE_URL || ""
                  }/products/download/${o.downloadVerificationId}`
                : undefined;
              return (
                <tr key={o.id} style={rowStyle}>
                  <td style={cellStyle}>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <img
                        src={imageSrc}
                        alt={o.product.name}
                        width={48}
                        height={48}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{o.product.name}</div>
                        {o.product.description && (
                          <div style={{ fontSize: 12, color: "#64748b" }}>
                            {o.product.description.slice(0, 60)}
                            {o.product.description.length > 60 ? "…" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={cellStyle}>{formatDate(o.createdAt)}</td>
                  <td style={cellStyle}>{displayPrice}</td>
                  <td style={cellStyle}>
                    {downloadLink ? (
                      <a
                        href={downloadLink}
                        style={{
                          display: "inline-block",
                          background: "#2563eb",
                          color: "#ffffff",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          textDecoration: "none",
                        }}
                      >
                        Download
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>
                        N/A
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={footerStyle}>
          If you did not request this email, you can ignore it.
        </div>
      </div>
    </div>
  );
}
