import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-surface-container-highest w-full border-t border-outline-variant mt-auto">
      <div className="w-full py-margin-desktop px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-start gap-gutter max-w-container-max mx-auto">
        <div className="flex flex-col gap-2 max-w-sm">
          <span className="font-label-md text-label-md font-bold text-on-surface mb-2">
            DepEd School Portal
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            © 2024 Philippine Public School. DepEd Division Office.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-gutter">
          <nav className="flex flex-col gap-2">
            <a
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 focus:ring-2 focus:ring-primary rounded"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 focus:ring-2 focus:ring-primary rounded"
              href="#"
            >
              Terms of Service
            </a>
          </nav>
          <nav className="flex flex-col gap-2">
            <a
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 focus:ring-2 focus:ring-primary rounded"
              href="#"
            >
              Transparency Seal
            </a>
            <Link
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 focus:ring-2 focus:ring-primary rounded"
              href="/contact"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
