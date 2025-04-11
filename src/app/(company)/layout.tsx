import React from 'react';

export const metadata = {
  title: 'Company Site',
  description: 'Welcome to the Company Site',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
