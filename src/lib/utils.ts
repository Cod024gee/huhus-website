export const formatKSh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;

export function normalizeKEPhone(input: string): string | null {
  const digits = input.replace(/\D/g,"");
  if (digits.startsWith("254") && digits.length===12) return digits;
  if (digits.startsWith("0") && digits.length===10) return "254"+digits.slice(1);
  if (digits.startsWith("7") && digits.length===9) return "254"+digits;
  if (digits.startsWith("1") && digits.length===9) return "254"+digits;
  return null;
}

export function isOpenNow(open="10:00", close="22:00") {
  const now = new Date();
  const [oh,om]=open.split(":").map(Number);
  const [ch,cm]=close.split(":").map(Number);
  const cur = now.getHours()*60+now.getMinutes();
  const o = oh*60+om;
  const c = ch*60+cm;
  if (o<c) return cur>=o && cur<c;
  return cur>=o || cur<c;
}
