import Private from "@/components/Private";
import HomeClient from "./home";

export default async function Page() {
  return (
    <>
      <Private />
      <HomeClient />
    </>
  );
}
