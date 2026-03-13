import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { peoples } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/serialization";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeopleStats } from "@/components/people/people-stats";

export default async function PeoplePage() {
    // Fetch all people sorted by name, including associated users for details
    const peopleList = await prisma.peoples.findMany({
        orderBy: {
            PeopleName: 'asc'
        },
        include: {
            users: true
        }
    });

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activePeople = peopleList.filter((p: peoples) => p.IsActive).length;
    const inactivePeople = peopleList.filter((p: peoples) => !p.IsActive).length;
    const newlyAdded = peopleList.filter((p: peoples) => new Date(p.Created) >= firstDayOfMonth).length;
    const totalPeople = peopleList.length;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">People</h2>
                    <p className="text-muted-foreground">
                        Manage all people and contacts in the system.
                    </p>
                </div>
                {/* Placeholder for Add People - functionality deferred */}
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/admin/people/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add People
                        </Link>
                    </Button>
                </div>
            </div>

            <PeopleStats
                totalPeople={totalPeople}
                activePeople={activePeople}
                inactivePeople={inactivePeople}
                newlyAdded={newlyAdded}
            />

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>All People</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={columns} 
                            data={serializeData(peopleList)} 
                            filterKeys={[
                                { id: "PeopleName", title: "Name" },
                                { id: "MobileNo", title: "Mobile" }
                            ]} 
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
