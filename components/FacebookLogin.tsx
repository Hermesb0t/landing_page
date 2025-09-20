"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function FacebookLogin() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => signIn("facebook")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Login with Facebook
      </button>
    );
  }

  return (
    <div>
      <p>Signed in as {session.user?.name}</p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-gray-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
