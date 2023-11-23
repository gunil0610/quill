import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Page = async () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { error, isSuccess, isError } = trpc.authCallback.useQuery(undefined, {
    queryKey: ["authCallback", undefined],
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    // onSuccess in useQuery is deprecated
    // https://github.com/TanStack/query/discussions/5279
    if (isSuccess) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [isSuccess, origin, router]);

  useEffect(() => {
    if (isError) {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    }
  }, [isError, router, error?.data?.code]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
