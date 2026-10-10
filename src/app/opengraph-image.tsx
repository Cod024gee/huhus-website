import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Huhu's Pizzas — Wood-fired, Nairobi-made";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFF8F0",
          padding: 48,
          border: "12px solid #E3350D",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 56, height: 56, background: "#E3350D", color: "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, transform: "rotate(-2deg)" }}>HUHU’S</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: -1 }}>HUHU’S PIZZAS</span>
              <span style={{ fontSize: 12, letterSpacing: 4, color: "#E3350D", fontWeight: 700 }}>NAIROBI • WOOD-FIRED</span>
            </div>
          </div>
          <span style={{ background: "#FFB800", padding: "8px 16px", fontWeight: 900, fontSize: 12, letterSpacing: 2 }}>OPEN TILL 22:00</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.85, letterSpacing: -3 }}>
            <span>PIZZA NI </span><span style={{ color: "#E3350D" }}>MOTO</span>
          </div>
          <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.85, letterSpacing: -3, color: "#9C8A82" }}>MOTO.</div>
          <div style={{ marginTop: 16, fontSize: 18, color: "#9C8A82", maxWidth: 600 }}>48-hour dough • 400°C wood oven • chilli honey. Order direct — moto moto.</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
          <span style={{ fontWeight: 700, background: "#1A0F0D", color: "#FFF8F0", padding: "12px 24px", borderRadius: 999 }}>ORDER NOW — huhuspizzas.co.ke</span>
          <span style={{ color: "#9C8A82" }}>Ngong Road • Delivery • Pickup • Dine-in</span>
        </div>
      </div>
    ),
    size
  );
}
