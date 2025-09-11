import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const adminEmails = ["yasirukularathne1234@gmail.com"];

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET || "",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      return adminEmails.includes(user.email); // deny non-admins
    },
    async session({ session }) {
      if (session?.user?.email) {
        (session.user as any).isAdmin = adminEmails.includes(session.user.email);
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email ?? "";
  if (!email || !adminEmails.includes(email)) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}
