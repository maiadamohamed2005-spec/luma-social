import { useQuery } from "@tanstack/react-query";
import { getIncomingFriendRequests } from "@/api/friends";
import { useAuth } from "@/context/AuthContext";

export const useIncomingFriendRequests = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["friend-requests", "incoming"],
    queryFn: () => getIncomingFriendRequests(token!),
    enabled: !!token,
  });
};