import "./globals.css";

export const metadata = {
  title: "EcoLearn - Apprentissage Intelligent avec IA",
  description: "Plateforme éducative innovante avec résumés automatiques et examens adaptatifs générés par intelligence artificielle.",
  keywords: "éducation, IA, résumés automatiques, examens, apprentissage, école, matières scolaires",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}