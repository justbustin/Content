import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-100 py-2 px-8 flex justify-between">
      <a href="/">
        <img src="conti.png" alt="Conti" className="h-12 w-auto" />
      </a>
      <div className="flex items-center justify-center">
        <a href="/generate" className=" hover:text-blue-500 font-semibold">
          Generate
        </a>
        <a href="/schedule" className="hover:text-blue-500 font-semibold ml-4">
          Schedule
        </a>
        <a href="/manage" className=" hover:text-blue-500 font-semibold ml-4">
          Manage
        </a>
      </div>
    </nav>
  );
}

