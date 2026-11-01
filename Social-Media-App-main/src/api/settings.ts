import { apiFetch } from "@/lib/api";

export type UpdatePasswordData = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

type UpdatePasswordResponse = {
  message: string;
};

export const updatePassword = async (
  token: string,
  data: UpdatePasswordData
): Promise<UpdatePasswordResponse> => {
  return apiFetch<UpdatePasswordResponse>(
    "/me/password",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
};