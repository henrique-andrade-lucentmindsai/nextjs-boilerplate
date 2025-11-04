export const metadata = {
  title: 'Bitrix Config Saver',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
        {children}
        {/* Bitrix SDK only matters inside Bitrix; harmless elsewhere */}
        <script src="https://api.bitrix24.com/api/v1/"></script>
      </body>
    </html>
  );
}