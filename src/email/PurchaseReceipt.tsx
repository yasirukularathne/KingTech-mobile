// Email functionality has been disabled for deployment compatibility
// This file maintains the interface but doesn't actually send emails

type PurchaseReceiptEmailProps = {
  product: {
    name: string
    imagePath: string
    description: string
  }
  order: { id: string; createdAt: Date; pricePaidInCents: number }
  downloadVerificationId: string
}

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  // Email functionality disabled - returns empty component
  return (
    <div style={{ display: "none" }}>
      <p>Email functionality has been disabled for deployment compatibility</p>
      <p>Product: {product.name}</p>
      <p>Order ID: {order.id}</p>
      <p>Download ID: {downloadVerificationId}</p>
    </div>
  )
}
