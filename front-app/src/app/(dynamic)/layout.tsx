import { redirect } from "next/navigation";
import Footer from "@/components/layout/footer";
import { auth } from "@/lib/auth";

export default async function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
