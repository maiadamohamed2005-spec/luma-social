import { apiFetch } from "@/lib/api";

export type GeneratePostData = {
  topic: string;
  tone:
    | "professional"
    | "casual"
    | "friendly"
    | "educational";
  language:
    | "english"
    | "arabic";
};

type GeneratePostResponse = {
  content: string;
};

export const generateAIPost = async (
  token: string,
  data: GeneratePostData
): Promise<GeneratePostResponse> => {
  return apiFetch<GeneratePostResponse>(
    "/ai/posts/generate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
};