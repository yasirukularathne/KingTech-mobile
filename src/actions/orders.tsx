"use server";

import db from "@/db/db";
import OrderHistoryEmail from "@/email/OrderHistory";
import { sendEmail } from "@/lib/nodemailer";
import { z } from "zod";

const emailSchema = z.string().email();

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return { error: "Invalid email address" };
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (user == null) {
    return {
      message:
        "Check your email to view your order history and download your products.",
    };
  }

  const orders = user.orders.map(
    async (order: {
      pricePaidInCents: number;
      id: string;
      createdAt: Date;
      product: {
        id: string;
        name: string;
        imagePath: string;
        description: string;
      };
    }) => {
      return {
        ...order,
        downloadVerificationId: (
          await db.downloadVerification.create({
            data: {
              expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
              productId: order.product.id,
            },
          })
        ).id,
      };
    }
  );

  // Format prices as Sri Lankan Rupees (LKR)
  const formattedOrders = await Promise.all(orders);
  type Product = {
    id: string;
    name: string;
    imagePath: string;
    description: string;
  };

  type Order = {
    id: string;
    pricePaidInCents: number;
    createdAt: Date;
    product: Product;
    downloadVerificationId?: string;
    pricePaidInCentsLKR?: string;
  };

  // ...existing code...

  // Render the email HTML using React
  const ReactDOMServer = (await import("react-dom/server")).default;
  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    <OrderHistoryEmail orders={formattedOrders} />
  );

  try {
    await sendEmail({
      to: user.email,
      subject: "Order History",
      html: emailHtml,
    });
    return {
      message:
        "Check your email to view your order history and download your products.",
    };
  } catch (error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }
}
