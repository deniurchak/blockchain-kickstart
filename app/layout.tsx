export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <h1>Kickstarter</h1>
        {children}
      </body>
    </html>
  );
}
