
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "@/server/auth";
import { AuthOptions } from "next-auth";

// Debug environment variables
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing");
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "Set" : "Missing");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

if (!process.env.NEXTAUTH_URL) {
  throw new Error("Missing NEXTAUTH_URL in environment variables");
}
console.log("Environment Mode:", process.env.NODE_ENV);

export const authOptions: AuthOptions = {
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt"
        // maxAge: process.env.JWT_EXPIRE // 1 day
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        })
    ],
    callbacks: {
        async signIn({ account, profile, user }) {
            if (account?.provider === "google") {
                try {
                    const res = await signIn(profile);
                    (user as any).isNewUser = res.isNewUser;
                    (user as any).isPro = res.isPro;
                    (user as any).isAdmin = res.isAdmin;
                } catch (err) {
                    console.log(err);
                }
                return true;
            }
            return false;
        },
        async jwt({ token, user, account, trigger, session }) {
            if (user) {
                token = { user, accessToken: account?.id_token };
                token.id = user.id;
                (token as any).isPro = (user as any).isPro;
            }
            if (trigger === "update") {
                (token.user as any).isNewUser = (session as any).isNewUser;
                (token.user as any).isPro = (session as any).isPro;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = (token as any).accessToken;
            session = { ...session, ...token };
            return session;
        },
        redirect({ url, baseUrl }) {
            // If the URL is relative, use it; otherwise redirect to dashboard
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // If URL is external but on the same domain, allow it
            if (url.startsWith(baseUrl)) return url;
            // Default to dashboard
            return `${baseUrl}/dashboard`;
        }
    },
    // Use dynamic URL for better port handling
    ...(process.env.NEXTAUTH_URL && { 
        url: process.env.NEXTAUTH_URL 
    })
};
