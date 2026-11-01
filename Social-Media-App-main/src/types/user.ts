
export type Friendship = {
  id: number;
  status: "pending" | "accepted";
};


export type User = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatar: string | null;
  cover_image: string | null;
  posts_count: number;
  friends_count: number;
  friendship: Friendship | null;
};
