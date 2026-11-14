import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "../../src/lib/session";

export default async function ClubLayout({
  children,
}: {
  children: ReactNode;
}) {
  const sesion = await getSession();

  if (!sesion) {
    redirect("/login");
  }

  return <>{children}</>;
}