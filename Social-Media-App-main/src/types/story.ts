export type StoryMediaType = "image" | "video";

export type StoryVisibility = "public" | "friends";

export type StoryUser = {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
};

export type StoryMedia = {
  url: string;
  type: StoryMediaType;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  duration: number | null;
};

export type Story = {
  id: number;
  media: StoryMedia;
  caption: string | null;
  visibility: StoryVisibility;
  is_viewed: boolean;
  views_count?: number;
  created_at: string;
  expires_at: string;
};

export type StoryGroup = {
  user: StoryUser;
  is_current_user: boolean;
  has_unseen_stories: boolean;
  stories: Story[];
};

export type StoriesResponse = {
  data: StoryGroup[];
};


export type StoryViewer = {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  viewed_at: string;
};

export type StoryViewersResponse = {
  views_count: number;
  viewers: StoryViewer[];
};