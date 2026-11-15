import { getAuth } from "../../../../src/lib/auth";

export const dynamic = "force-dynamic";

function handleAuth(request: Request) {
  return getAuth().handler(request);
}

export { handleAuth as GET, handleAuth as POST };