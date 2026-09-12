"use client";
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

useEffect(function () {
    function onScroll() {
        setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return function () {
        window.removeEventListener("scroll", onScroll);
    };
}, []);

useEffect(function () {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return function () {
        document.body.style.overflow = "";
    };
}, [mobileOpen]);

const navLinks = [
    { href: "/destinations", label: "Destinations" },
    { href: "/#standard", label: "The Standard" },
    { href: "/experiences", label: "Experiences" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
    ];

const isSolid = scrolled || mobileOpen;

if (pathname === "/admin_panel" || pathname.startsWith("/admin_panel/")) return null;

return React.createElement("header", {
    className: "fixed top-0 inset-x-0 z-50 transition-all duration-500 " + (isSolid ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"),
},
                           React.createElement("div", { className: "max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[110px]" },
                                               React.createElement(Link, { href: "/", onClick: function () { setMobileOpen(false); }, className: "w-[114px] h-[114px] flex items-center justify-center bg-[#97183C] text-white font-semibold rounded-sm overflow-hidden shrink-0" }, "Ritumbhara", React.createElement("sup", { className: "text-[9px] ml-0.5 font-normal" }, "\u00AE")),
                                               React.createElement("nav", { className: "hidden lg:flex items-center gap-10 text-[15px] font-medium" },
                                                                   navLinks.map(function (link) {
                                                                       return React.createElement(Link, { key: link.href, href: link.href }, link.label);
                                                                   })
                                                                   ),
                                               React.createElement(Link, { href: "/destinations", className: "hidden lg:block border border-[#97183C] text-[#97183C] px-6 py-2.5 rounded-sm font-medium hover-fine:bg-[#97183C] hover-fine:text-white active:scale-[0.97] active:duration-100 active:ease-out transition-[background-color,color,transform] duration-200 ease-snap" }, "Explore Destinations"),
                                               React.createElement("button", {
                                                   type: "button",
                                                   "aria-label": mobileOpen ? "Close menu" : "Open menu",
                                                   "aria-expanded": mobileOpen,
                                                   className: "lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5",
                                                   onClick: function () { setMobileOpen(!mobileOpen); },
                                               },
                                                                   React.createElement("span", { className: "block w-6 h-0.5 rounded-full transition-transform duration-300 " + (isSolid ? "bg-[#1A1A1A]" : "bg-white") + " " + (mobileOpen ? "translate-y-2 rotate-45" : "") }),
                                                                   React.createElement("span", { className: "block w-6 h-0.5 rounded-full transition-opacity duration-300 " + (isSolid ? "bg-[#1A1A1A]" : "bg-white") + " " + (mobileOpen ? "opacity-0" : "") }),
                                                                   React.createElement("span", { className: "block w-6 h-0.5 rounded-full transition-transform duration-300 " + (isSolid ? "bg-[#1A1A1A]" : "bg-white") + " " + (mobileOpen ? "-translate-y-2 -rotate-45" : "") })
                                                                   )
                                               ),
                           mobileOpen && React.createElement("nav", { className: "lg:hidden bg-white border-t border-[#EDE7DD] shadow-lg" },
                                                             React.createElement("div", { className: "flex flex-col px-6 py-6 gap-1" },
                                                                                 navLinks.map(function (link) {
                                                                                     return React.createElement(Link, {
                                                                                         key: link.href,
                                                                                         href: link.href,
                                                                                         onClick: function () { setMobileOpen(false); },
                                                                                         className: "py-3 text-[16px] font-medium text-[#1A1A1A] border-b border-[#F5F1EA] last:border-b-0",
                                                                                     }, link.label);
                                                                                 }),
                                                                                 React.createElement(Link, {
                                                                                     href: "/destinations",
                                                                                     onClick: function () { setMobileOpen(false); },
                                                                                     className: "mt-4 block text-center border border-[#97183C] text-[#97183C] px-6 py-3 rounded-sm font-medium active:scale-[0.97] transition-transform duration-200 ease-snap",
                                                                                 }, "Explore Destinations")
                                                                                 )
                                                             )
                           );
}
