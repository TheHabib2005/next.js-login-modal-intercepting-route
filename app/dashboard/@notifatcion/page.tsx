import { wait } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Notifatcion = async () => {
  await wait(5000);
  return (
    <div>
      Notifatcion <Link href={"/dashboard/achrive"}>Achrive</Link>
    </div>
  );
};

export default Notifatcion;
