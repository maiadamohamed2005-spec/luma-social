import AddPost from "@/components/post/AddPost";
import Feed from "@/components/post/Feed";
import LeftMenu from "@/components/layout/LeftMenu";
import RightMenu from "@/components/layout/RightMenu";
import Stories from "@/components/stories/Stories";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import MobileAIAssistant from "@/components/ai/MobileAIAssistant";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="flex gap-6 pt-6">
        {/* Left Sidebar */}
        <div className="hidden w-[20%] xl:block">
          <LeftMenu type="home" />
        </div>

        {/* Main Feed */}
        <div className="w-full lg:w-[70%] xl:w-[50%]">
          <div className="flex flex-col gap-6">
            <Stories />
            <AddPost />
            <Feed />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden w-[30%] lg:block">
          <RightMenu />
        </div>
      </div>

      {/* Mobile / Tablet AI Assistant */}
      <MobileAIAssistant />
    </ProtectedRoute>
  );
}