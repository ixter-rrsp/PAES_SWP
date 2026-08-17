import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-surface-container-highest w-full border-t border-outline-variant mt-auto">
      <div className="w-full pt-margin-desktop px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-wrap items-center gap-6 md:gap-8 pb-margin-desktop border-b border-outline-variant">
          <Image
            src="/Department_of_Education.svg"
            alt="Department of Education"
            width={48}
            height={48}
            className="shrink-0 h-12 w-auto"
          />
          <Image
            src="/Schools-Division-Office-Caloocan.png"
            alt="Schools Division Office - Caloocan"
            width={48}
            height={48}
            className="shrink-0 h-12 w-auto rounded"
          />
          <Image
            src="/PAES.svg"
            alt="Pag-Asa Elementary School"
            width={48}
            height={48}
            className="shrink-0 h-12 w-auto"
          />
          <Image
            src="/Bagong-Pilipinas.png"
            alt="Bagong Pilipinas"
            width={48}
            height={48}
            className="shrink-0 h-12 w-auto"
          />
        </div>
      </div>

      <div className="w-full py-margin-desktop px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-start gap-gutter max-w-container-max mx-auto">
        <div className="flex flex-col gap-2 max-w-sm">
          <span className="flex items-center gap-2 font-label-md text-label-md font-bold text-on-surface mb-2">
            <Image src="/PAES.svg" alt="Pag-Asa Elementary School logo" width={28} height={28} className="shrink-0" />
            Pag-Asa Elementary School
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
