import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Akash Holidays - Best Travel Agency in Lucknow | Tour Packages',
    template: '%s | Akash Holidays',
  },
  description: 'Akash Holidays — top-rated travel agency in Lucknow. Book Kashmir, Himachal, Ladakh, Thailand, Turkey, Malaysia, London & more tour packages at best prices. 24/7 support.',
  keywords: 'travel agency Lucknow, tour packages Lucknow, Kashmir tour, Himachal tour, Ladakh tour, Thailand tour, Turkey tour, Malaysia tour, London tour, international tour packages, domestic tour packages, Akash Holidays',
  metadataBase: new URL('https://akashholidays.com'),
  alternates: { canonical: 'https://akashholidays.com' },
  openGraph: {
    title: 'Akash Holidays - Best Travel Agency in Lucknow',
    description: 'Top-rated travel agency in Lucknow. International & domestic tour packages at best prices.',
    url: 'https://akashholidays.com/',
    siteName: 'Akash Holidays',
    images: [{ url: 'https://akashholidays.com/img/Logos.png', width: 1200, height: 630, alt: 'Akash Holidays' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akash Holidays - Best Travel Agency in Lucknow',
    description: 'Top-rated travel agency in Lucknow. International & domestic tour packages at best prices.',
    images: ['https://akashholidays.com/img/Logos.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: { google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE' },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TravelAgency',
      '@id': 'https://akashholidays.com/#organization',
      name: 'Akash Holidays',
      url: 'https://akashholidays.com',
      logo: 'https://akashholidays.com/img/Logos.png',
      telephone: '+919839685724',
      email: 'pramod.srivastava1975@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot No 62, Shukla Vihar Para',
        addressLocality: 'Lucknow',
        addressRegion: 'Uttar Pradesh',
        postalCode: '226001',
        addressCountry: 'IN',
      },
      sameAs: ['https://wa.me/919839685724'],
      priceRange: '₹₹',
      openingHours: 'Mo-Su 09:00-21:00',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://akashholidays.com/#website',
      url: 'https://akashholidays.com',
      name: 'Akash Holidays',
      publisher: { '@id': 'https://akashholidays.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://akashholidays.com/packages/{search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Script src="https://code.jquery.com/jquery-3.4.1.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js" strategy="afterInteractive" />
        <Script id="site-init" strategy="afterInteractive">{`
          $(window).on('load', function () {
            $('#spinner').fadeOut(400, function () { $(this).removeClass('show'); });
          });
          $(window).scroll(function () {
            if ($(this).scrollTop() > 45) {
              $('.navbar').addClass('sticky-top shadow-sm');
            } else {
              $('.navbar').removeClass('sticky-top shadow-sm');
            }
            if ($(this).scrollTop() > 300) {
              $('.back-to-top').fadeIn('slow');
            } else {
              $('.back-to-top').fadeOut('slow');
            }
          });
          $('.back-to-top').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
            return false;
          });
          $(document).ready(function () {
            new WOW({ offset: 80, mobile: true, live: true }).init();
            $(".testimonial-carousel").owlCarousel({
              autoplay: true, smartSpeed: 800, center: true,
              margin: 24, dots: true, loop: true, nav: false,
              responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } }
            });
            var $dropdown = $(".dropdown"), showClass = "show";
            $(window).on("load resize", function () {
              if (this.matchMedia("(min-width: 992px)").matches) {
                $dropdown.hover(
                  function () { var $t=$(this); $t.addClass(showClass); $t.find(".dropdown-toggle").attr("aria-expanded","true"); $t.find(".dropdown-menu").addClass(showClass); },
                  function () { var $t=$(this); $t.removeClass(showClass); $t.find(".dropdown-toggle").attr("aria-expanded","false"); $t.find(".dropdown-menu").removeClass(showClass); }
                );
              } else { $dropdown.off("mouseenter mouseleave"); }
            });
            $('video').each(function () {
              var v = this;
              v.addEventListener('canplay', function () {
                $(v).addClass('loaded');
                $(v).siblings('.about-poster-img, .hero-poster-img').addClass('hide');
              });
            });
          });
        `}</Script>
      </body>
    </html>
  )
}
