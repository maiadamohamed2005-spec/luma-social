import Image from "next/image";
import Link from "next/link";

const Birthdays = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">

     {/* TOP */}
    <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500">Birthdays</span>
        
    </div>
    {/* USER */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src="https://images.pexels.com/photos/38777121/pexels-photo-38777121.jpeg" alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover"/>
        <span className="font-semibold">Ali Issam</span>
      </div>
      <div className="flex justify-end gap-3">
        <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">Celabrate</button>
      </div>
    </div>

    {/*UPCOMING */}
    <div className="p-4 bg-slate-100 rounded-lg flex items-center gap-4 ">

    <Image src="/gift.png" alt="" width={24} height={24}/>
     <Link href="/" className="flex flex-col gap-1 text-xs">
     <span className="text-gray-700 font-semibold ">Upcoming Birthdays</span>
     <span className="text-gray-500">See other 13 have upcoming birthdays</span>
     </Link>   

    </div>

    </div>
  )
}

export default Birthdays;