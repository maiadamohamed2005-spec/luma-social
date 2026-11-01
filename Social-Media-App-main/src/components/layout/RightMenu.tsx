"use client";

import Ad from "../common/Ad";
import UserInfoCard from "../profile/UserInfoCard";
import UserMediaCard from "../profile/UserMediaCard";

import AIPostAssistant from "@/components/ai/AIPostAssistant";
import { useUserProfile } from "@/hooks/profile/useProfile";

type RightMenuProps = {
  userId?: string;
  isOwnProfile?: boolean;
};

const RightMenu = ({
  userId,
  isOwnProfile = false,
}: RightMenuProps) => {
  const { data: user } = useUserProfile(
    Number(userId)
  );

  return (
    <div className="flex flex-col gap-6">
      {userId && user ? (
        <>
          <UserInfoCard
            user={user}
            isOwnProfile={isOwnProfile}
          />

          <UserMediaCard
            userId={userId}
          />
        </>
      ) : null}

      {/* Only show on non-profile pages */}
      {!userId && <AIPostAssistant />}

      <Ad size="md" />
    </div>
  );
};

export default RightMenu;