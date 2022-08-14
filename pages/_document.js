import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          {/* <link
            rel="preload"
            href="/fonts/SourceCodePro-Bold.ttf"
            as="style"
            crossOrigin="anonymous"></link>
          <link
            rel="preload"
            href="/fonts/SourceCodePro-Regular.ttf"
            as="style"
            crossOrigin="anonymous"></link>
          <link
            rel="preload"
            href="/fonts/SourceCodePro-SemiBold.ttf"
            as="style"
            crossOrigin="anonymous"></link> */}
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
