import { stackServerApp } from "../../stack";
import { redirect } from "next/navigation";
 
export default async function DashboardPage() {
    const user = await stackServerApp.getUser();
 
    if (!user) {
        redirect("/handler/sign-in");
    }
 
    return (
        <div>
            <h1>Welcome {user.displayName}</h1>
        </div>
    );
}