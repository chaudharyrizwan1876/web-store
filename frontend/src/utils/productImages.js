const imageModules = import.meta.glob("../assets/images/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const imageByFileName = Object.fromEntries(
  Object.entries(imageModules).map(([path, src]) => [path.split("/").pop(), src])
);

export const resolveProductImage = (image, fallback = "") => {
  if (!image || typeof image !== "string") return fallback;

  const value = image.trim();
  if (!value) return fallback;

  if (/^(https?:|data:|blob:)/i.test(value) || value.startsWith("/uploads/")) {
    return value;
  }

  const fileName = value.replace(/\\/g, "/").split("/").pop();
  return imageByFileName[fileName] || fallback || value;
};

export const resolveProductImages = (images = [], fallbackImages = []) => {
  const resolved = (Array.isArray(images) ? images : [])
    .map((image) => resolveProductImage(image))
    .filter(Boolean);

  return resolved.length > 0 ? resolved : fallbackImages;
};
