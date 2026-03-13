import SubCategoryForm from '@/components/forms/sub-category-form';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function EditSubCategoryPage({ params }: { params: Promise<{ subId: string }> }) {
    const { subId: paramSubId } = await params;
    const subId = parseInt(paramSubId);

    if (isNaN(subId)) notFound();

    const subCategory = await prisma.sub_categories.findUnique({
        where: { SubCategoryID: subId }
    });

    if (!subCategory) notFound();

    return (
         <div className="p-6">
            <SubCategoryForm subCategory={subCategory} />
        </div>
    );
}
