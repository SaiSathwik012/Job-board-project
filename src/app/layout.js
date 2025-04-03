import { Toaster } from 'react-hot-toast';
import './globals.css';

const metadata = {
  title: 'CareerConnect - Job Board',
  description: 'Find your dream job or post opportunities with CareerConnect',
  keywords: ['jobs', 'career', 'employment', 'hiring', 'recruitment'],
  authors: [{ name: 'Your Company', url: 'https://yourwebsite.com' }],
  openGraph: {
    title: 'CareerConnect - Job Board',
    description: 'Find your dream job or post opportunities with CareerConnect',
    url: 'https://yourwebsite.com',
    siteName: 'CareerConnect',
    images: [
      {
        url: 'https://yourwebsite.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerConnect - Job Board',
    description: 'Find your dream job or post opportunities with CareerConnect',
    images: ['https://yourwebsite.com/twitter-image.jpg'],
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'font-sans',
            duration: 5000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;
export { metadata };
