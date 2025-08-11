'use client';

import { title } from "@/components/primitives";
import { useSession } from "next-auth/react";

export default function AboutPage() {
  const session = useSession();

  return (
    <div>
      <h1 className={title()}>About</h1>
      <p>{session.data?.user?.name}</p>
    </div>
  );
}
