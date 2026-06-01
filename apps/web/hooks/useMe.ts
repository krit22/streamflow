import { useQuery } from "@tanstack/react-query";
import { fetchMe, sessionQueryKey } from "@/lib/session";

export function useMe() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchMe,
    retry: false,
    staleTime: Infinity,
  });
}
