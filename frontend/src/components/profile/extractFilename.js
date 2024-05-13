export const extractFileName = (url) => {
  // Split the URL by '/' and get the last segment
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];

  // Firebase URLs often contain URL-encoded elements, so decode it
  const decodedLastPart = decodeURIComponent(lastPart);

  // Optionally, remove any query parameters if present
  const fileName = decodedLastPart.split("?")[0];

  return fileName;
};
