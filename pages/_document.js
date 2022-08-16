import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <link
            rel="stylesheet preload prefetch"
            href="/fonts/SourceCodePro-Bold.ttf"
            as="style"
            type="text/css"
            crossOrigin="anonymous"></link>
          <link
            rel="stylesheet preload prefetch"
            href="/fonts/SourceCodePro-Regular.ttf"
            as="style"
            type="text/css"
            crossOrigin="anonymous"></link>
          <link
            rel="stylesheet preload prefetch"
            href="/fonts/SourceCodePro-SemiBold.ttf"
            as="style"
            type="text/css"
            crossOrigin="anonymous"></link>
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
