export default async function handler(req: any, res: any) {
  if (req.method !== "POST") { res.statusCode = 405; res.end("Method Not Allowed"); return; }
  try {
    const body = await new Promise<string>((resolve) => {
      let data = ""; req.on("data", (c: Buffer) => data += c.toString()); req.on("end", () => resolve(data));
    });
    const { phone } = JSON.parse(body || "{}");
    const norm = String(phone || "").replace(/\D/g, "");
    if (norm.length < 10) { res.statusCode = 400; res.setHeader("Content-Type","application/json"); res.end(JSON.stringify({ success:false, error:"Invalid phone" })); return; }
    // Demo: pretend to send SMS. OTP is 123456
    res.statusCode = 200; res.setHeader("Content-Type","application/json"); res.end(JSON.stringify({ success:true, demo:true }));
  } catch {
    res.statusCode = 500; res.setHeader("Content-Type","application/json"); res.end(JSON.stringify({ success:false, error:"Server error" }));
  }
}
