import type { PortableTextBlock } from "@portabletext/types";

/** Flatten Portable Text blocks into a single plain-text string. */
export function portableTextToPlain(
  blocks: PortableTextBlock[] | null | undefined,
  separator = " ",
): string {
  if (!blocks?.length) return "";

  return blocks
    .map((block) => {
      if (block._type !== "block" || !("children" in block) || !Array.isArray(block.children)) {
        return "";
      }
      return block.children
        .map((child) =>
          typeof child === "object" && child && "text" in child
            ? String(child.text ?? "")
            : "",
        )
        .join("");
    })
    .filter(Boolean)
    .join(separator);
}
