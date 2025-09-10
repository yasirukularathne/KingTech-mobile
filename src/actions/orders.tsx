"use server";

import db from "@/db/db";
import OrderHistoryEmail from "@/email/OrderHistory";
import nodemailer from "nodemailer";
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

  const orders = user.orders.map(async (order) => {
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
  });

  // Create Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Format prices as Sri Lankan Rupees (LKR)
  const formattedOrders = await Promise.all(orders);
  formattedOrders.forEach((order) => {
    order.pricePaidInCentsLKR = new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(order.pricePaidInCents / 100);
  });

  // Render the email HTML using React
  const ReactDOMServer = (await import("react-dom/server")).default;
  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    <OrderHistoryEmail orders={formattedOrders} />
  );

  try {
    await transporter.sendMail({
      from: `Support <${process.env.SENDER_EMAIL}>`,
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
