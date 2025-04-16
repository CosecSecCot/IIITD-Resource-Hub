export function extractGoogleDriveFileID(url: string): string | undefined {
  const match = url.match(
    /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//,
  );
  return match ? match[1] : undefined;
}
