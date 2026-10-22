import type { ProjectScreenshot } from "@/types/project";

// Owner-approved local evidence. No Sanity asset upload or document write.
export const projectGalleries: Readonly<
  Record<string, readonly ProjectScreenshot[]>
> = {
  "car-rental-system": [
    {
      id: "rentals-listing",
      label: "Rentals",
      src: "/images/projects/car-rental-system/rentals-listing.webp",
      previewSrc:
        "/images/projects/car-rental-system/rentals-listing-preview.webp",
      thumbnailSrc:
        "/images/projects/car-rental-system/rentals-listing-thumb.webp",
      srcSet:
        "/images/projects/car-rental-system/rentals-listing-480.webp 480w, /images/projects/car-rental-system/rentals-listing-960.webp 960w, /images/projects/car-rental-system/rentals-listing-1440.webp 1440w, /images/projects/car-rental-system/rentals-listing.webp 2048w",
      alt: "Mileway rentals listing with active and completed rental records.",
      caption:
        "Rental records in Mileway. Customer records are approved demonstration data.",
      width: 2048,
      height: 1526,
    },
    {
      id: "book-car-form",
      label: "Book a car",
      src: "/images/projects/car-rental-system/book-car-form.webp",
      previewSrc:
        "/images/projects/car-rental-system/book-car-form-preview.webp",
      thumbnailSrc:
        "/images/projects/car-rental-system/book-car-form-thumb.webp",
      srcSet:
        "/images/projects/car-rental-system/book-car-form-480.webp 480w, /images/projects/car-rental-system/book-car-form-960.webp 960w, /images/projects/car-rental-system/book-car-form-1440.webp 1440w, /images/projects/car-rental-system/book-car-form.webp 1906w",
      alt: "Mileway booking form with customer, car, rental dates, and rental estimate.",
      caption: "Car booking form and rental estimate.",
      width: 1906,
      height: 2048,
    },
    {
      id: "customers-listing",
      label: "Customers",
      src: "/images/projects/car-rental-system/customers-listing.webp",
      previewSrc:
        "/images/projects/car-rental-system/customers-listing-preview.webp",
      thumbnailSrc:
        "/images/projects/car-rental-system/customers-listing-thumb.webp",
      srcSet:
        "/images/projects/car-rental-system/customers-listing-480.webp 480w, /images/projects/car-rental-system/customers-listing-960.webp 960w, /images/projects/car-rental-system/customers-listing-1440.webp 1440w, /images/projects/car-rental-system/customers-listing.webp 2048w",
      alt: "Mileway customers listing with customer details and management actions.",
      caption: "Customer management using approved demonstration records.",
      width: 2048,
      height: 1548,
    },
    {
      id: "add-car-form",
      label: "Add a car",
      src: "/images/projects/car-rental-system/add-car-form.webp",
      previewSrc:
        "/images/projects/car-rental-system/add-car-form-preview.webp",
      thumbnailSrc:
        "/images/projects/car-rental-system/add-car-form-thumb.webp",
      srcSet:
        "/images/projects/car-rental-system/add-car-form-480.webp 480w, /images/projects/car-rental-system/add-car-form-960.webp 960w, /images/projects/car-rental-system/add-car-form-1440.webp 1440w, /images/projects/car-rental-system/add-car-form.webp 1973w",
      alt: "Mileway add-car form for vehicle information, pricing, and availability.",
      caption: "Vehicle information, pricing, and availability form.",
      width: 1973,
      height: 2048,
    },
    {
      id: "cars-listing",
      label: "Cars",
      src: "/images/projects/car-rental-system/cars-listing.webp",
      previewSrc:
        "/images/projects/car-rental-system/cars-listing-preview.webp",
      thumbnailSrc:
        "/images/projects/car-rental-system/cars-listing-thumb.webp",
      srcSet:
        "/images/projects/car-rental-system/cars-listing-480.webp 480w, /images/projects/car-rental-system/cars-listing-960.webp 960w, /images/projects/car-rental-system/cars-listing-1440.webp 1440w, /images/projects/car-rental-system/cars-listing.webp 2048w",
      alt: "Mileway car listing with vehicle availability, daily rates, and booking actions.",
      caption: "Cars listing and availability.",
      width: 2048,
      height: 2020,
    },
  ],
  "marketlink-solo": [
    {
      id: "homepage",
      label: "Homepage",
      src: "/images/projects/marketlink-solo/homepage.webp",
      previewSrc: "/images/projects/marketlink-solo/homepage-preview.webp",
      thumbnailSrc: "/images/projects/marketlink-solo/homepage-thumb.webp",
      srcSet:
        "/images/projects/marketlink-solo/homepage-480.webp 480w, /images/projects/marketlink-solo/homepage-960.webp 960w, /images/projects/marketlink-solo/homepage-1440.webp 1440w, /images/projects/marketlink-solo/homepage.webp 1800w",
      alt: "MarketLink Solo homepage introducing market pickup and demonstration announcements.",
      caption: "In-progress homepage with fictional demonstration records.",
      width: 1800,
      height: 2048,
    },
    {
      id: "products-listing",
      label: "Products",
      src: "/images/projects/marketlink-solo/products-listing.webp",
      previewSrc:
        "/images/projects/marketlink-solo/products-listing-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-solo/products-listing-thumb.webp",
      srcSet:
        "/images/projects/marketlink-solo/products-listing-480.webp 480w, /images/projects/marketlink-solo/products-listing.webp 629w",
      alt: "MarketLink Solo product catalogue showing demonstration products and illustrative photography.",
      caption:
        "Product catalogue. Product photography is illustrative; records are fictional.",
      width: 629,
      height: 2048,
    },
    {
      id: "product-details-bananas",
      label: "Bananas",
      src: "/images/projects/marketlink-solo/product-details-bananas.webp",
      previewSrc:
        "/images/projects/marketlink-solo/product-details-bananas-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-solo/product-details-bananas-thumb.webp",
      srcSet:
        "/images/projects/marketlink-solo/product-details-bananas-480.webp 480w, /images/projects/marketlink-solo/product-details-bananas-960.webp 960w, /images/projects/marketlink-solo/product-details-bananas-1440.webp 1440w, /images/projects/marketlink-solo/product-details-bananas.webp 1925w",
      alt: "MarketLink Solo bananas detail screen with demonstration product information and review.",
      caption: "Bananas product details using fictional demonstration records.",
      width: 1925,
      height: 2048,
    },
    {
      id: "farmers-listing",
      label: "Farmers",
      src: "/images/projects/marketlink-solo/farmers-listing.webp",
      previewSrc:
        "/images/projects/marketlink-solo/farmers-listing-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-solo/farmers-listing-thumb.webp",
      srcSet: "/images/projects/marketlink-solo/farmers-listing.webp 375w",
      alt: "Long MarketLink Solo farmers listing with demonstration grower cards.",
      caption: "Farmers listing. Enlarge to inspect this long screenshot.",
      width: 375,
      height: 2048,
    },
    {
      id: "markets-listing",
      label: "Markets",
      src: "/images/projects/marketlink-solo/markets-listing.webp",
      previewSrc:
        "/images/projects/marketlink-solo/markets-listing-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-solo/markets-listing-thumb.webp",
      srcSet:
        "/images/projects/marketlink-solo/markets-listing-480.webp 480w, /images/projects/marketlink-solo/markets-listing.webp 710w",
      alt: "Long MarketLink Solo markets listing with demonstration market cards.",
      caption: "Markets listing using fictional demonstration records.",
      width: 710,
      height: 2047,
    },
    {
      id: "farmer-dashboard",
      label: "Farmer dashboard",
      src: "/images/projects/marketlink-solo/farmer-dashboard.webp",
      previewSrc:
        "/images/projects/marketlink-solo/farmer-dashboard-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-solo/farmer-dashboard-thumb.webp",
      srcSet:
        "/images/projects/marketlink-solo/farmer-dashboard-480.webp 480w, /images/projects/marketlink-solo/farmer-dashboard-960.webp 960w, /images/projects/marketlink-solo/farmer-dashboard-1440.webp 1440w, /images/projects/marketlink-solo/farmer-dashboard.webp 2048w",
      alt: "MarketLink Solo farmer dashboard showing sample inventory, orders, and sales summaries.",
      caption:
        "Farmer dashboard with demonstration inventory and order records.",
      width: 2048,
      height: 1837,
    },
    {
      id: "admin-dashboard",
      label: "Admin dashboard",
      src: "/images/projects/marketlink-solo/admin-dashboard.webp",
      previewSrc:
        "/images/projects/marketlink-solo/admin-dashboard-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-solo/admin-dashboard-thumb.webp",
      srcSet:
        "/images/projects/marketlink-solo/admin-dashboard-480.webp 480w, /images/projects/marketlink-solo/admin-dashboard-960.webp 960w, /images/projects/marketlink-solo/admin-dashboard-1440.webp 1440w, /images/projects/marketlink-solo/admin-dashboard.webp 2048w",
      alt: "MarketLink Solo administration overview with sample counts and order status summaries.",
      caption:
        "Admin dashboard. Displayed counts are demonstration data, not business outcomes.",
      width: 2048,
      height: 2046,
    },
  ],
  "school-website-cms": [
    {
      id: "public-homepage",
      label: "Public homepage",
      src: "/images/projects/school-website-cms/public-homepage.webp",
      previewSrc:
        "/images/projects/school-website-cms/public-homepage-preview.webp",
      thumbnailSrc:
        "/images/projects/school-website-cms/public-homepage-thumb.webp",
      srcSet: "/images/projects/school-website-cms/public-homepage.webp 355w",
      alt: "Long public school homepage with introduction, news, and school information sections.",
      caption:
        "Public school website homepage. Enlarge to inspect the long page.",
      width: 355,
      height: 2048,
    },
    {
      id: "admin-dashboard",
      label: "Admin dashboard",
      src: "/images/projects/school-website-cms/admin-dashboard.webp",
      previewSrc:
        "/images/projects/school-website-cms/admin-dashboard-preview.webp",
      thumbnailSrc:
        "/images/projects/school-website-cms/admin-dashboard-thumb.webp",
      srcSet:
        "/images/projects/school-website-cms/admin-dashboard-480.webp 480w, /images/projects/school-website-cms/admin-dashboard-960.webp 960w, /images/projects/school-website-cms/admin-dashboard-1440.webp 1440w, /images/projects/school-website-cms/admin-dashboard.webp 1522w",
      alt: "School CMS administration dashboard with content summaries and management navigation.",
      caption:
        "Earlier dashboard capture labelled Phase 1 Foundation, before subsequent project completion. It does not demonstrate every completed workflow or establish school adoption.",
      width: 1522,
      height: 2048,
    },
  ],
  "marketlink-team": [
    {
      id: "homepage",
      label: "Homepage",
      src: "/images/projects/marketlink-team/homepage.webp",
      previewSrc: "/images/projects/marketlink-team/homepage-preview.webp",
      thumbnailSrc: "/images/projects/marketlink-team/homepage-thumb.webp",
      srcSet:
        "/images/projects/marketlink-team/homepage-480.webp 480w, /images/projects/marketlink-team/homepage-960.webp 960w, /images/projects/marketlink-team/homepage.webp 1440w",
      alt: "MarketLink Team homepage with market and product discovery entry points.",
      caption:
        "Public homepage captured over HTTPS. Displayed counters are not independently verified outcomes.",
      width: 1440,
      height: 1050,
    },
    {
      id: "markets-listing",
      label: "Markets",
      src: "/images/projects/marketlink-team/markets-listing.webp",
      previewSrc:
        "/images/projects/marketlink-team/markets-listing-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-team/markets-listing-thumb.webp",
      srcSet:
        "/images/projects/marketlink-team/markets-listing-480.webp 480w, /images/projects/marketlink-team/markets-listing-960.webp 960w, /images/projects/marketlink-team/markets-listing.webp 1440w",
      alt: "MarketLink Team markets directory with location, day, and sorting controls.",
      caption: "Public markets directory and visible filtering controls.",
      width: 1440,
      height: 1050,
    },
    {
      id: "market-details",
      label: "Market details",
      src: "/images/projects/marketlink-team/market-details.webp",
      previewSrc:
        "/images/projects/marketlink-team/market-details-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-team/market-details-thumb.webp",
      srcSet:
        "/images/projects/marketlink-team/market-details-480.webp 480w, /images/projects/marketlink-team/market-details-960.webp 960w, /images/projects/marketlink-team/market-details.webp 1440w",
      alt: "MarketLink Team market details showing market information and visiting schedule.",
      caption:
        "Market detail interface reached through application navigation. Displayed records are not independently verified.",
      width: 1440,
      height: 1050,
    },
    {
      id: "products-listing",
      label: "Products",
      src: "/images/projects/marketlink-team/products-listing.webp",
      previewSrc:
        "/images/projects/marketlink-team/products-listing-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-team/products-listing-thumb.webp",
      srcSet:
        "/images/projects/marketlink-team/products-listing-480.webp 480w, /images/projects/marketlink-team/products-listing-960.webp 960w, /images/projects/marketlink-team/products-listing.webp 1440w",
      alt: "MarketLink Team product catalogue with category and season controls.",
      caption:
        "Public product catalogue. Some source-site photographs do not match their labels; no transaction functionality is implied.",
      width: 1440,
      height: 1050,
    },
    {
      id: "product-details",
      label: "Product details",
      src: "/images/projects/marketlink-team/product-details.webp",
      previewSrc:
        "/images/projects/marketlink-team/product-details-preview.webp",
      thumbnailSrc:
        "/images/projects/marketlink-team/product-details-thumb.webp",
      srcSet:
        "/images/projects/marketlink-team/product-details-480.webp 480w, /images/projects/marketlink-team/product-details-960.webp 960w, /images/projects/marketlink-team/product-details.webp 1440w",
      alt: "MarketLink Team honey detail interface displaying watermelon photography and an empty order form.",
      caption:
        "Public product details, captured unchanged: the source site displays mismatched product photography. No order was submitted.",
      width: 1440,
      height: 1050,
    },
  ],
};
