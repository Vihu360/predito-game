import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { UserProps } from "./type";
import { useRouter } from "next/navigation";

export function useAdminGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);

  useEffect(() => {
    if (status === "loading") return;

    if (!(session?.user as UserProps)?.isAdmin) {
      router.replace("/404");
    }
  }, [session, status, router]);

  return { isAdmin: (session?.user as UserProps)?.isAdmin, isLoading: status === "loading" };
}