import NextAuth from 'next-auth';
import prisma from "@/app/libs/prismadb";
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'



const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const user = await prisma.student.findUnique({
                    where: { email: credentials.email }
                });
                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    return user
                }
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token = user
            }
            return token
        },
        async session({ session, token }) {
            session = token
            return session;
        },
    },
    secret: 'super secret',
});


export { handler as GET, handler as POST }

