import { apiFetch } from "@/lib/api";

export type SearchUser = {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
};

export type SearchUsersResponse = {
  data: SearchUser[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export const searchUsers = async (
  token: string,
  query: string
): Promise<SearchUsersResponse> => {
  const searchQuery = encodeURIComponent(
    query.trim()
  );

  return apiFetch<SearchUsersResponse>(
    `/users/search?q=${searchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};