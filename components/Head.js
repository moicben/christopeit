import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const MyHead = ({ title, description, name, domain, favicon, graph, font, colorPrimary, colorSecondary, colorBlack, colorGrey, bgMain, bgLight, bgDark, radiusBig, radiusMedium, tag, pixel }) => {
  const router = useRouter();
  const pageSlug = router.asPath === '/' ? '' : router.asPath.replace(/\/$/, ''); // Supprime le slash final si présent

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="icon" href={favicon} />
      <link rel="canonical" href={`https://www.${domain}${pageSlug}`} />

      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={name} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://www.${domain}${pageSlug}`} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={graph} />
      <meta property="og:image:secure_url" content={graph} />

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

      {/* Custom CSS Style From Supabase Shop */}
      <style>
        {`
          .radius-medium,
          button {
            border-radius: ${radiusMedium};
          }

          .radius-big,
          .card {
            border-radius: ${radiusBig};
          }

          .color-primary {
            color: ${colorPrimary} !important;
          }

          .color-black{
            color: ${colorBlack};
          }

          .color-grey {
            color: ${colorGrey};
          }

          .color-secondary{
            color: ${colorSecondary};
          }

          .bg-primary,
          button {
            background-color: ${colorPrimary} ;
          }

          .bg-main {
            background-color: ${bgMain};
          }

          .bg-light {
            background-color: ${bgLight};
          }

          .bg-white{
            background-color: #fff;
          }

          .bg-grey{
            background-color: #f1f1f1;
          }

          .bg-dark {
            background-color: ${bgDark};
          }

          .border-primary{
            border-color: ${colorPrimary} !important;
          }

          .border-top-primary{
            border-top-color: ${colorPrimary} !important;
          }
        `}
      </style>


      {/* Google tag */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17143410321"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${tag}');
        `
      }} />
   


      {/* Meta Pixel Code */}
      {pixel && (
        <>
          <script dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixel}');
              fbq('track', 'PageView');
            `
          }} />
          <noscript>
            <img height="1" width="1" style={{display:'none'}}
            src={`https://www.facebook.com/tr?id=${pixel}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* Hotjar Tracking Code */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:5325018,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `
      }} />

    </Head>
  );
};

export default MyHead;