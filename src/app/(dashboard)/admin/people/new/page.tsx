import { redirect } from "next/navigation";
import PeopleForm from "@/components/forms/people-form";
import { verifySession } from "@/lib/session";

export default async function NewPeoplePage() {
    const session = await verifySession();
    if (!session) return redirect("/login");

    return (
        <div className="container mx-auto py-10">
            <PeopleForm />
        </div>
    );
}
