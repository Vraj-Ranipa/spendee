import CategoryForm from '@/components/forms/category-form';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (isNaN(id)) {
        notFound();
    }

    const category = await prisma.categories.findUnique({
        where: { CategoryID: id }
    });

    if (!category) {
        notFound();
    }

    return (
         <div className="p-6">
            <CategoryForm category={category} />
        </div>
    );
}
