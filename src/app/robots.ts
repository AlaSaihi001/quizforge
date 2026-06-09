import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: ["/dashboard/", "/api/", "/share/"],
        // On n'indexe pas les pages privées
        // Mais on laisse /share/ accessible aux humains, pas aux bots
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}