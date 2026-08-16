import SiteHeader from "@/components/site/layout/header";
import SiteFooter from "@/components/site/layout/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
