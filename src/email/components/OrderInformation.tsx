// Email functionality has been disabled for deployment compatibility
// This file maintains the interface but doesn't actually send emails

import { formatCurrency } from "@/lib/formatters"

type OrderInformationProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number }
  product: { imagePath: string; name: string; description: string }
  downloadVerificationId: string
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

export function OrderInformation({
  order,
  product,
  downloadVerificationId,
}: OrderInformationProps) {
  // Email functionality disabled - returns empty component
  return (
    <div style={{ display: "none" }}>
      <p>Email functionality has been disabled for deployment compatibility</p>
      <p>Product: {product.name}</p>
      <p>Order ID: {order.id}</p>
      <p>Price: {formatCurrency(order.pricePaidInCents / 100)}</p>
      <p>Date: {dateFormatter.format(order.createdAt)}</p>
      <p>Download ID: {downloadVerificationId}</p>
    </div>
  )
}
