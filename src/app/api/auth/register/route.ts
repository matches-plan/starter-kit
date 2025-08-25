import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const schema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().optional(),
    phone: z.string().min(10).max(11).optional(),
});

export async function POST(req: Request) {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    const { email, password, name, phone } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
        return NextResponse.json(
            { error: 'Email already registered' },
            { status: 409 }
        );

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { email, name, passwordHash, phone },
    });
    return NextResponse.json(
        {
            user,
        },
        { status: 201 }
    );
}
