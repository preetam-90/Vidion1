"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/handler/sign-in");
    }, [router]);

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h1>Redirecting to Sign In...</h1>
            <p>If you are not redirected automatically, please click <a href="/handler/sign-in">here</a>.</p>
        </div>
    );
}