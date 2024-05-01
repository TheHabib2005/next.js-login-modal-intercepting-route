import LogoutButton from "@/components/LogoutButton";
import { cookies } from "next/headers";
import Link from "next/link";



const Home = () => {
  return (
    <div>
      <h1>home page</h1>
      <Link href={"/login"}>Login</Link>
      <LogoutButton />
    </div>
  );
};

export default Home;
