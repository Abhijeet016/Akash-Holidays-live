import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Akash Holidays - Best Travel Agency in Lucknow | Tour Packages India',
    template: '%s | Akash Holidays Lucknow',
  },
  description: 'Akash Holidays — #1 travel agency in Lucknow. Book Kashmir, Himachal, Ladakh, Kedarnath, Char Dham, Goa, Kerala, Thailand, Dubai, Maldives & 50+ tour packages at best prices. Call +91-9839685724.',
  keywords: 'travel agency Lucknow, tour packages Lucknow, best travel agent Lucknow, Kashmir tour package, Himachal tour, Ladakh tour, Kedarnath yatra, Char Dham yatra, Goa tour, Kerala tour, Thailand tour, Dubai tour, Maldives honeymoon, international tour packages, domestic tour packages, religious tour packages, honeymoon packages Lucknow, family tour packages, Akash Holidays, cheap tour packages Lucknow, pilgrimage tours Lucknow',
  metadataBase: new URL('https://akash-holidays.in'),
  alternates: { canonical: 'https://akash-holidays.in' },
  openGraph: {
    title: 'Akash Holidays - Best Travel Agency in Lucknow | 50+ Tour Packages',
    description: '#1 travel agency in Lucknow. Kashmir, Char Dham, Goa, Kerala, Thailand, Dubai & 50+ packages at best prices. 10,000+ happy travelers.',
    url: 'https://akash-holidays.in/',
    siteName: 'Akash Holidays',
    images: [{ url: 'https://akash-holidays.in/img/Logos.png', width: 1200, height: 630, alt: 'Akash Holidays - Best Travel Agency in Lucknow' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akash Holidays - Best Travel Agency in Lucknow',
    description: '#1 travel agency in Lucknow. 50+ tour packages at best prices. Call +91-9839685724.',
    images: ['https://akash-holidays.in/img/Logos.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } },
  verification: { google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE' },
  category: 'travel',
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['TravelAgency', 'LocalBusiness'],
      '@id': 'https://akash-holidays.in/#organization',
      name: 'Akash Holidays',
      alternateName: 'Akash Holidays Lucknow',
      url: 'https://akash-holidays.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://akash-holidays.in/img/Logos.png',
        width: 200,
        height: 200,
      },
      image: 'https://akash-holidays.in/img/Logos.png',
      description: 'Akash Holidays is the #1 travel agency in Lucknow offering 50+ domestic and international tour packages including Kashmir, Char Dham, Goa, Kerala, Thailand, Dubai and Maldives.',
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
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 26.8266,
        longitude: 80.8721,
      },
      hasMap: 'https://maps.app.goo.gl/wAWjPw4BUNJDLQyo8',
      sameAs: [
        'https://wa.me/919839685724',
        'https://www.facebook.com/akashholidays',
        'https://www.instagram.com/akashholidays',
      ],
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, Credit Card, UPI, Bank Transfer',
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '09:00', closes: '21:00' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '10000',
        bestRating: '5',
        worstRating: '1',
      },
      areaServed: [
        { '@type': 'City', name: 'Lucknow' },
        { '@type': 'State', name: 'Uttar Pradesh' },
        { '@type': 'Country', name: 'India' },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://akash-holidays.in/#website',
      url: 'https://akash-holidays.in',
      name: 'Akash Holidays',
      publisher: { '@id': 'https://akash-holidays.in/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://akash-holidays.in/packages/{search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which is the best travel agency in Lucknow?',
          acceptedAnswer: { '@type': 'Answer', text: 'Akash Holidays is the top-rated travel agency in Lucknow with 15+ years of experience, 10,000+ happy travelers, and 50+ domestic and international tour packages.' },
        },
        {
          '@type': 'Question',
          name: 'What tour packages does Akash Holidays offer?',
          acceptedAnswer: { '@type': 'Answer', text: 'Akash Holidays offers Kashmir tours, Char Dham Yatra, Kedarnath packages, Goa tours, Kerala backwaters, Himachal Pradesh, Ladakh, Thailand, Dubai, Maldives, and 50+ more domestic and international packages.' },
        },
        {
          '@type': 'Question',
          name: 'How can I book a tour package from Lucknow?',
          acceptedAnswer: { '@type': 'Answer', text: 'You can book a tour package by calling +91-9839685724, WhatsApp messaging, or filling the enquiry form on our website. Our team responds within 24 hours.' },
        },
        {
          '@type': 'Question',
          name: 'Does Akash Holidays offer Char Dham Yatra packages?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, Akash Holidays offers complete Char Dham Yatra packages covering Yamunotri, Gangotri, Kedarnath and Badrinath with accommodation, transport and guide.' },
        },
        {
          '@type': 'Question',
          name: 'What is the contact number of Akash Holidays Lucknow?',
          acceptedAnswer: { '@type': 'Answer', text: 'You can contact Akash Holidays at +91-9839685724 (also available on WhatsApp) or email at pramod.srivastava1975@gmail.com.' },
        },
      ],
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
