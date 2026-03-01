export default function handler(req: any, res: any) {
  const variants = ["/og-images/og-1.svg", "/og-images/og-2.svg", "/og-images/og-3.svg", "/og-images/og-4.svg", "/og-images/og-5.svg"];
  const idx = Math.floor(Date.now() / (1000 * 60 * 60 * 2)) % variants.length;
  const destination = variants[idx];
  res.statusCode = 302;
  res.setHeader("Location", destination);
  res.end();
}
