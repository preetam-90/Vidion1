"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/handler/sign-up");
    }, [router]);

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h1>Redirecting to Sign Up...</h1>
            <p>If you are not redirected automatically, please click <a href="/handler/sign-up">here</a>.</p>
        </div>
    );
}