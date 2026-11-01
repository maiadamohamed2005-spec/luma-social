import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getPost } from "@/api/posts";

export const usePost = (postId: number) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(token!, postId),
    enabled: !!token && !!postId,
  });
};