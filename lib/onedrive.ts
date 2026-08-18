/**
 * OneDrive folder links, unlike Google Drive, can't be browsed
 * server-side with a service account in this setup — Microsoft
 * gates the folder behind a sign-in, and whoever opens the link
 * authenticates with their own OneDrive/Microsoft 365 credentials.
 * So there's no API integration here, just link storage + a sanity
 * check that what was pasted actually looks like a OneDrive share
 * link before we save it.
 *
 * Recognized shapes:
 *   https://onedrive.live.com/?id=...&cid=...
 *   https://1drv.ms/f/s!AbCdEf...              (shortened share link)
 *   https://<tenant>.sharepoint.com/:f:/g/...  (OneDrive for Business / SharePoint)
 */
const ONEDRIVE_HOST_PATTERN =
  /^https:\/\/([a-z0-9-]+\.)*(onedrive\.live\.com|1drv\.ms|sharepoint\.com)(\/|$)/i;

export function isLikelyOneDriveUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ONEDRIVE_HOST_PATTERN.test(url);
  } catch {
    return false;
  }
}

export function normalizeOneDriveUrl(url: string): string {
  return url.trim();
}
