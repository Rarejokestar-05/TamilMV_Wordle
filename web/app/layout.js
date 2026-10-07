import "./globals.css";

export const metadata = {
  title: "Kollywooddle — Tamil Movie Guessing Game (Spotle & 3v3)",
  description: "Guess the mystery Tamil movie in 7 attempts! Spotle-style clues for director, cast, year, genre & runtime with 3v3 friend room mode.",
  keywords: ["tamil movies", "movie game", "spotle", "wordle", "kollywood", "tamil cinema", "tamil quiz"],
  authors: [{ name: "Kollywooddle Team" }],
  openGraph: {
    title: "Kollywooddle — The Ultimate Tamil Movie Guessing Game",
    description: "Can you guess today's mystery Tamil film in 7 tries? Play solo or challenge your friends in 3v3 rooms!",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07090e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
