import CategoryForm from '@/components/forms/category-form';
import React from 'react';

export default async function AddCategoryPage() {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return (
        <div className="p-6">
            <CategoryForm /> 
        </div>
    );
}
