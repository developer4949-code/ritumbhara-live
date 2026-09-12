import React from "react";
import Image from "next/image";
import { properties } from "@/config/properties.config";
import { destinations } from "@/config/destinations.config";
import { testimonials } from "@/config/testimonials.config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return properties.map(function (p) { return { slug: p.slug }; });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const property = properties.find(function (p) { return p.slug === params.slug; });
  if (!property) return {};
  const title = property.name;
  return {
    title: property.metaTitle || title,
    description: property.metaDescription || property.description,
    keywords: [property.name, property.propertyType, property.destinationSlug, "Ritumbhara", "boutique stays", "luxury " + property.propertyType],
    alternates: { canonical: "https://ritumbhara.com/properties/" + property.slug },
    openGraph: {
      title: property.metaTitle || title,
      description: property.metaDescription || property.description,
      url: "https://ritumbhara.com/properties/" + property.slug,
      images: [{ url: property.heroImage, width: 1200, height: 630, alt: property.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: property.metaTitle || title,
      description: property.metaDescription || property.description,
      images: [property.heroImage],
    },
  };
}

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const property = properties.find(function (p) { return p.slug === params.slug; });
  if (!property) return notFound();
  const destination = destinations.find(function (d) { return d.slug === property.destinationSlug; });
  const matchingTestimonial = destination ? testimonials.find(function (t) { return t.location.toLowerCase() === destination.name.toLowerCase(); }) : undefined;

  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.name,
    description: property.description,
    image: property.heroImage,
    telephone: property.contact.phone,
    email: property.contact.email,
    url: "https://ritumbhara.com/properties/" + property.slug,
    address: destination ? { "@type": "PostalAddress", addressLocality: destination.name, addressRegion: destination.state, addressCountry: "IN" } : undefined,
    amenityFeature: property.amenities.map(function (a) {
      return { "@type": "LocationFeatureSpecification", name: a, value: true };
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ritumbhara.com" },
      { "@type": "ListItem", position: 2, name: "Destinations", item: "https://ritumbhara.com/destinations" },
      destination ? { "@type": "ListItem", position: 3, name: destination.name, item: "https://ritumbhara.com/destinations/" + destination.slug } : null,
      { "@type": "ListItem", position: 4, name: property.name, item: "https://ritumbhara.com/properties/" + property.slug },
    ].filter(Boolean),
  };

  return React.createElement(React.Fragment, null,
    React.createElement("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(lodgingSchema) } }),
    React.createElement("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(breadcrumbSchema) } }),
    property.faqSchema && Object.keys(property.faqSchema).length > 0 && 
      React.createElement("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(property.faqSchema) } }),
    React.createElement("div", { className: "relative h-[58vh] min-h-[380px] w-full overflow-hidden" },
      React.createElement(Image, { src: property.heroImage, alt: property.name, fill: true, sizes: "100vw", quality: 70, priority: true, className: "object-cover" }),
      React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" }),
      React.createElement("div", { className: "absolute top-24 left-0 right-0 px-6 lg:px-10" },
        React.createElement("nav", { className: "max-w-7xl mx-auto text-xs text-white/80 flex items-center gap-2" },
          React.createElement("a", { href: "/", className: "hover:text-white" }, "Home"),
          React.createElement("span", null, "/"),
          destination && React.createElement(React.Fragment, null,
            React.createElement("a", { href: "/destinations/" + destination.slug, className: "hover:text-white" }, destination.name),
            React.createElement("span", null, "/")
          ),
          React.createElement("span", { className: "text-white" }, property.name)
        )
      ),
      React.createElement("div", { className: "absolute bottom-0 left-0 right-0 px-6 lg:px-10 pb-8" },
        React.createElement("div", { className: "max-w-7xl mx-auto" },
          React.createElement("span", { className: "inline-block text-xs font-semibold uppercase tracking-wide bg-white/95 text-[#1A1A1A] px-3 py-1.5 rounded-full mb-3" }, property.propertyType),
          React.createElement("h1", { className: "text-4xl lg:text-5xl font-semibold text-white drop-shadow-sm" }, property.h1 || property.name),
          destination && React.createElement("p", { className: "text-white/85 text-sm mt-2" }, destination.name + ", " + destination.state)
        )
      )
    ),
    React.createElement("main", { className: "max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-28 lg:pb-24" },
    React.createElement("div", { className: "grid lg:grid-cols-3 gap-16" },
      React.createElement("div", { className: "lg:col-span-2" },
        React.createElement("p", { className: "text-lg text-[#4A4A4A] mb-10" }, property.description),
        property.amenities.length > 0
          ? React.createElement(React.Fragment, null,
              React.createElement("h2", { className: "text-2xl font-semibold mb-6" }, "Amenities"),
              React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4" },
                property.amenities.map(function (a) {
                  return React.createElement("div", { key: a, className: "text-sm" }, "\u2022 " + a);
                })
              )
            )
          : React.createElement("p", { className: "text-sm text-[#4A4A4A] italic" }, "Full amenity details for this property are available on request \u2014 contact us using the details alongside.")
      ),
      matchingTestimonial && React.createElement("div", { className: "border border-[#EDE7DD] bg-[#F5F1EA] rounded-md p-6 mt-10" },
        React.createElement("blockquote", { className: "text-[#1A1A1A] text-base leading-relaxed mb-3" }, "\u201C" + matchingTestimonial.quote + "\u201D"),
        React.createElement("p", { className: "text-sm text-[#8A8A8A] font-medium" }, matchingTestimonial.guestLabel + " \u2014 a guest in " + matchingTestimonial.location)
      ),
      React.createElement("aside", { className: "border border-[#EDE7DD] rounded-md p-7 h-fit lg:sticky lg:top-32" },
        React.createElement("div", { className: "flex items-center gap-2 mb-5 text-xs font-semibold text-[#97183C] bg-[#F5F1EA] rounded-md px-3 py-2 w-fit" },
          React.createElement("span", null, "\u2605 Airbnb Superhost")
        ),
        React.createElement("p", { className: "mb-1" }, property.contact.phone),
        React.createElement("p", { className: "mb-6" }, property.contact.email),
        React.createElement("a", { href: property.hotelSpiderBookingUrl, target: "_blank", rel: "noopener", className: "block text-center bg-[#97183C] text-white font-medium py-3.5 rounded-md mb-3" }, "Check Availability & Book"),
        React.createElement("a", { href: "https://wa.me/919503002629?text=" + encodeURIComponent("Hi, I'd like to check availability for " + property.name), target: "_blank", rel: "noopener", className: "flex items-center justify-center gap-2 border border-[#97183C] text-[#97183C] font-medium py-3 rounded-md mb-5" }, "WhatsApp Us"),
        React.createElement("p", { className: "text-xs text-center text-[#8A8A8A]" }, "Book direct with Ritumbhara \u2014 no OTA booking fees")
      )
    ),
    React.createElement("div", { className: "fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-[#EDE7DD] p-3 flex gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]" },
      React.createElement("a", { href: "https://wa.me/919503002629?text=" + encodeURIComponent("Hi, I'd like to check availability for " + property.name), target: "_blank", rel: "noopener", className: "flex-1 text-center border border-[#97183C] text-[#97183C] font-medium py-3 rounded-md text-sm" }, "WhatsApp"),
      React.createElement("a", { href: property.hotelSpiderBookingUrl, target: "_blank", rel: "noopener", className: "flex-1 text-center bg-[#97183C] text-white font-medium py-3 rounded-md text-sm" }, "Check Availability")
    )
    )
  );
}
