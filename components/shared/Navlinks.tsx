'use client'

import { sidebarLinks } from "@/constants"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

type position = "leftsidebar" | "bottombar"

type TNavlinkProps={
    position: position
}

export default function Navlinks({position}:TNavlinkProps){
    const pathname = usePathname()
    const pClassName = position === "leftsidebar" ? "text-light-1 max-lg:hidden" : "text-subtle-medium text-light-1 max-sm:hidden"
    const d = position === "leftsidebar" ? "relative flex justify-start gap-4 rounded-lg p-4" : "relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5"
    return sidebarLinks.map((link) =>{
        const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route
        return  (
          <Link href={link.route} key={link.label} className={`${d} ${isActive && 'bg-primary-500'}`}>
          <Image src={link.imgURL} alt={link.label} width={24} height={24} />
          <p className={pClassName}>{ position === "leftsidebar" ? link.label : link.label.split(/\s+/)[0]}</p>
        </Link>
      )})
}