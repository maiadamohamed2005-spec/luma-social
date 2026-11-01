import { useQuery } from "@tanstack/react-query";
import { getFriends } from "@/api/friends";
import { useAuth } from "@/context/AuthContext";

type UseFriendsOptions = {
  enabled?: boolean;
};

export const useFriends = ({
  enabled = true,
}: UseFriendsOptions = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(token!),
    enabled: !!token && enabled,
  });
};