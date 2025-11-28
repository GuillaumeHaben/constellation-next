export function getProfilePictureUrl(user, apiBase = process.env.NEXT_PUBLIC_API_URL) {
  const pic = user?.profilePicture;
  if (!pic) return null;

  const url = pic?.url ?? pic; // supports object with url or raw string
  if (!url) return null;

  // Absolute URL already
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;

  const base = (apiBase || '').replace(/\/$/, '');
  const path = String(url).startsWith('/') ? String(url) : `/${url}`;
  return `${base}${path}`;
}
