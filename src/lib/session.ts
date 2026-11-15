import { headers } from "next/headers";
import { getAuth } from "./auth";

export async function getSession() {
  const requestHeaders = await headers();
  return getAuth().api.getSession({ headers: requestHeaders });
}