import SubCategoryForm from '@/components/forms/sub-category-form';
import React from 'react';

export default async function AddSubCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: paramId } = await params;
    const categoryId = parseInt(paramId);

    return (
        <div className="p-6">
            <SubCategoryForm categoryId={categoryId} /> 
        </div>
    );
}
