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
                    return (user);
                } else {
                    return (null);
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id
            console.log('Session User:', token);
            return session;
        },
        async jwt(token, user) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    },


    secret: 'your-secret-goes-here',
});


export { handler as GET, handler as POST }