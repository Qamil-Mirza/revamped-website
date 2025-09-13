import type {
    MetadataRoute
} from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://qamil-miza.com";
    const paths = [
        "/",
        "/about",
        "/moonshot",
        "/projects",
        "/sidequests",
        "/contact",
    ]

    const today = new Date().toISOString().slice(0, 10);


    return paths.map((path) => ({
        url: `${base}${path}`,
        lastModified: today,
        changeFrequency: "monthly",
        priority: path === "/" ? 1 : 0.8,
    }));
}