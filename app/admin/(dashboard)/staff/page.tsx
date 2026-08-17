import { getAllStaff } from "@/lib/data/staff";
import StaffClient from "./StaffClient";

export default async function Page() {
  const staff = await getAllStaff();

  return <StaffClient initialStaff={staff} />;
}
