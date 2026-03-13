
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import IncomeForm from '@/components/forms/income-form';
import { serializeData } from '@/lib/serialization';
import React from 'react';

// Ensure the params are typed correctly as a Promise for Next.js 15+
export default async function EditIncomePage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    const session = await verifySession();
    const isUser = (session?.role as string)?.toUpperCase() === 'USER';
    const userId = session?.userId ? Number(session.userId) : undefined;

    const [income, categories, subCategories, peoples, projects] = await Promise.all([
        prisma.incomes.findFirst({ where: { IncomeID: Number(id) } }),
        prisma.categories.findMany({ where: { IsActive: true } }),
        prisma.sub_categories.findMany({ where: { IsActive: true } }),
        prisma.peoples.findMany({
            where: {
                IsActive: true,
                ...(isUser && userId ? { UserID: userId } : {})
            }
        }),
        prisma.projects.findMany({ where: { IsActive: true } })
    ]);

    if (!income) {
        return <div>Income not found</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Income</h1>
            <IncomeForm
                income={serializeData(income)}
                categories={serializeData(categories)}
                subCategories={serializeData(subCategories)}
                people={serializeData(peoples)}
                projects={serializeData(projects)}
            />
        </div>
    );
}