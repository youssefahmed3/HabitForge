import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2 bg-slate-700 p-4 rounded-2xl text-white">
        {/* Maybe Logo */}
        <h1 className="text-3xl font-bold">HabitForge</h1>
        <p>Forge your future, one habit at a time</p>
        <div className="flex justify-between items-center gap-2">
          <Link href="/register">
            <Button className="bg-white text-black cursor-pointer hover:bg-black hover:text-white">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-white text-black cursor-pointer hover:bg-black hover:text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
