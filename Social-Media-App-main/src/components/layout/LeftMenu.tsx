import Link from "next/link";
import ProfileCard from "../profile/ProfileCard";
import Image from "next/image";
import Ad from "../common/Ad";


const menuItems = [
  {
    name: "My Posts",
    href: "/",
    icon: "/posts.png",
  },
  {
    name: "Activity",
    href: "/",
    icon: "/activity.png",
  },
  {
    name: "Marketplace",
    href: "/",
    icon: "/market.png"
  },
  {
    name: "Albums",
    href: "/",
    icon: "/albums.png"
  },
  {
    name: "Videos",
    href: "/",
    icon: "/videos.png"
  },
  {
    name: "News",
    href: "/",
    icon: "/news.png"
  },
  {
    name: "Courses",
    href: "/",
    icon: "/courses.png"
  },
  {
    name: "Lists",
    href: "/",
    icon: "/lists.png"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "/settings.png",
  }
];


const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
  return (
    <div className="flex flex-col gap-6">

      {type === "home" && <ProfileCard />}

      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md text-sm text-gray-500">

        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
          >
            <Image
              src={item.icon}
              alt=""
              width={20}
              height={20}
            />

            <span>{item.name}</span>
          </Link>
        ))}

      </div>
      <Ad size="sm" />
    </div>
  );
};

export default LeftMenu;