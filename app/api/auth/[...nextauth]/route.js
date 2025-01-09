import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const user = await db.collection("users").findOne({ email });

        if (!user) throw new Error("No user found with this email");

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error("Invalid credentials");

        return { id: user._id.toString(), email: user.email }; // Ensure id is returned as a string
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add the user ID to the token on the first sign-in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the user ID to the session object
      if (token.id) {
        session.user = { ...session.user, id: token.id };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this matches your environment
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };