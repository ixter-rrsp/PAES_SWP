import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-surface-container-highest w-full border-t border-outline-variant mt-auto">
      <div className="w-full pt-margin-desktop px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-8 pb-margin-desktop border-b border-outline-variant">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8">
            <Image
              src="/Department_of_Education.svg"
              alt="Department of Education"
              width={40}
              height={40}
              className="shrink-0 h-10 w-auto"
            />
            <Image
              src="/Schools-Division-Office-Caloocan.png"
              alt="Schools Division Office - Caloocan"
              width={40}
              height={40}
              className="shrink-0 h-10 w-auto rounded"
            />
            <Image
              src="/PAES.svg"
              alt="Pag-Asa Elementary School"
              width={40}
              height={40}
              className="shrink-0 h-10 w-auto"
            />
            <Image
              src="/Bagong-Pilipinas.png"
              alt="Bagong Pilipinas"
              width={40}
              height={40}
              className="shrink-0 h-10 w-auto"
            />
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant sm:ml-auto">
            An official website of the Department of Education, Schools Division Office – Caloocan
          </p>
        </div>
      </div>

      <div className="w-full py-margin-desktop px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-start gap-8 md:gap-gutter max-w-container-max mx-auto">
        <div className="flex flex-col gap-2 max-w-sm">
          <span className="flex items-center gap-2 font-label-md text-label-md font-bold text-on-surface mb-2">
            <Image src="/PAES.svg" alt="Pag-Asa Elementary School logo" width={28} height={28} className="shrink-0" />
            Pag-Asa Elementary School
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            © 2024 Philippine Public School. DepEd Division Office.
          </p>
        </div>
        <div className="flex flex-row flex-wrap gap-x-10 gap-y-6 w-full md:w-auto">
          <nav className="flex flex-col gap-2">
            <Link
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 focus:ring-2 focus:ring-primary rounded"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 focus:ring-2 focus:ring-primary rounded"
              href="/terms-of-service"
            >
              Terms of Service
            </Link>
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
