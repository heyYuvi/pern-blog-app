import slugify from "slugify";

export function createUniqueSlug(title: string): string {

    const slug = slugify(title, {
        lower: true,
        trim: true,
        strict: true,
        replacement: "-"
    });

    const date = new Date().toISOString().split("T")[0];

    return `${slug}-${date}`
}