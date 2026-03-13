import ProjectForm from '@/components/forms/project-form';
import React from 'react';

export default async function AddProjectPage() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
            <ProjectForm /> 
        </div>
    );
}
