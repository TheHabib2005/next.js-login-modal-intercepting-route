import { wait } from "@/lib/utils";
import React from "react";

const Users = async () => {
  await wait(3000);
  return <div>Userst</div>;
};

export default Users;
