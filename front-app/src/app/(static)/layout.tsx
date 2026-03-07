import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function staticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
