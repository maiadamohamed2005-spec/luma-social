import { useQuery } from "@tanstack/react-query";
import { getStories } from "@/api/stories";
import { useAuth } from "@/context/AuthContext";

export const useStories = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["stories"],
    queryFn: () => getStories(token!),
    enabled: Boolean(token),
  });
};