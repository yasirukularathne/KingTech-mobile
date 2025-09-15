import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET || "",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID || "",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      return adminEmails.includes(user.email.toLowerCase());
    },
    async session({ session }) {
      if (session?.user?.email) {
        (session.user as any).isAdmin = adminEmails.includes(
          session.user.email.toLowerCase()
        );
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);
  const email = (session?.user?.email || "").toLowerCase();
  if (!email || !adminEmails.includes(email)) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}
