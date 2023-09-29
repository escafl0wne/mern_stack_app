'use client'
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navlinks from "./Navlinks";

export default function LeftSidebar() {
  const router = useRouter()
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {" "}
        <Navlinks position="leftsidebar"/>
      </div>
      <div className="mt-10 px-6">
      <SignedIn>
            <SignOutButton signOutCallback={()=> router.push("/sign-in")}>
              <div className="flex cursor-pointer gap-4 p-4">
                <Image
                  alt="logout"
                  src="/assets/logout.svg"
                  width={24}
                  height={24}
                />
                <p className="text-light-2 max-lg:hidden">Logout</p>
              </div>
            </SignOutButton>
          </SignedIn>

      </div>
    </section>
  );
}
