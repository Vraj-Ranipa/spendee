import ProjectForm from '@/components/forms/project-form';
import { prisma } from '@/lib/prisma';
import React from 'react';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const project = await prisma.projects.findUnique({
        where: { ProjectID: id }
    });

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
            <ProjectForm project={project} /> 
        </div>
    );
}
