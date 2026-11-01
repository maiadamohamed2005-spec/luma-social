import Image from "next/image";

const Ad = ({size}:{size:"sm" | "md" | "lg"}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">

    {/* TOP */}
   
    <div className="flex items-center justify-between font-medium text-gray-500">
    <span>Sponsored Ads</span>
    <Image src="/more.png" alt="" width={16} height={16} className="cursor-pointer"/>
    </div>

    {/* BOTTOM */}
   
    <div className={`flex flex-col mt-4 ${size ==="sm" ? "gap-2":"gap-4"}`}>
    
    <div className={`relative w-full ${size==="sm" ? "h-24":size==="md" ? "h-36" :"h-48"}`}>
     <Image src="https://images.pexels.com/photos/34208988/pexels-photo-34208988.jpeg" alt="" fill className="rounded-lg object-cover"/>
    </div>
     <div className="flex items-center gap-4">
      <Image src="https://images.pexels.com/photos/34208988/pexels-photo-34208988.jpeg" alt="" width={24} height={24} className="rounded-full  object-cover w-6 h-6"/>
      <span className="text-blue-500 font-medium">Santoloco</span>
     </div>
    <p className={size ==="sm" ? "text-xs":"text-sm"}>
        {size === "sm" ?"Lorem ipsum dolor sit amet, consectetur adipiscing elit." :size === "md" ?"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum iaculis orci non dui interdum convallis.":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum iaculis orci non dui interdum convallis. Nulla non tellus quis neque vulputate porta sit amet id libero."}
    </p>

    <button className="bg-gray-200 text-gray-500 p-2 text-xs rounded-lg">Learn more</button>

    </div>
    </div>
  )
}

export default Ad;