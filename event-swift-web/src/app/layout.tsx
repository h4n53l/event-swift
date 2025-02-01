import Background from './components/background';
import Navbar from './components/navigation/navbar';
import './global.css';
export const metadata = {
  title: 'Event Swift',
  description: 'Seamless Event Planning',
  image: 'images/EventSwiftIcon.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="images/EventSwiftIcon.png" sizes="any" />
      </head>
      <body>
        <Background>
        <Navbar />
        {children}
        </Background>
        </body>
    </html>
  );
}
