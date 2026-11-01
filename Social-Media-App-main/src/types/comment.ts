export type CommentUser = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;

  likes_count: number;
  is_liked: boolean;

  user: CommentUser;
  replies?: Comment[];
};

export type CommentsResponse = {
  comments: Comment[];
};

export type CommentResponse = {
  message: string;
  comment: Comment;
};