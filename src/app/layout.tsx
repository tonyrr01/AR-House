import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Housekeeping 5 Estrellas",
  description: "Operacion de limpieza, inventario y mantenimiento para Airbnb."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
