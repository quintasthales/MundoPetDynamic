// src/components/Analytics.tsx - Analytics Tracking
"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Google Analytics pageview tracking
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_path: pathname + searchParams.toString(),
      });
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel */}
      {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}

// Track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  // Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }

  // Facebook Pixel
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', eventName, eventParams);
  }

  console.log('Event tracked:', eventName, eventParams);
};

// E-commerce specific tracking functions
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  trackEvent('add_to_cart', {
    currency: 'BRL',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
};

export const trackPurchase = (order: {
  orderId: string;
  total: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}) => {
  trackEvent('purchase', {
    transaction_id: order.orderId,
    currency: 'BRL',
    value: order.total,
    items: order.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

export const trackViewProduct = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  trackEvent('view_item', {
    currency: 'BRL',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      },
    ],
  });
};

export const trackBeginCheckout = (cart: {
  total: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}) => {
  trackEvent('begin_checkout', {
    currency: 'BRL',
    value: cart.total,
    items: cart.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};
