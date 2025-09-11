// This file has been disabled due to dependency conflicts
// Email functionality is handled by other services

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  console.log("Email functionality disabled");
  return { messageId: "disabled" };
}
