import type { AppProps } from 'next/app'
import Script from 'next/script'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import DefaultLayout from '../layout/defaultLayout'
import '@/styles/globals.scss'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
    <DefaultLayout>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6525817591650373" crossOrigin="anonymous" />
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WHFLDXZWSL"></Script>

      <Script
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WHFLDXZWSL', {
            page_path: window.location.pathname,
            });
            `,
        }}
      />

      <Component {...pageProps} />
    </DefaultLayout>
    </QueryClientProvider>
  )
}
