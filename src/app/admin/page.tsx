import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="space-x-4">
        <Link href="/admin/users">
          <Button>View Users</Button>
        </Link>
        <Link href="/admin/charities">
          <Button>Manage Charities</Button>
        </Link>
        <Link href="/admin/draw">
          <Button>Run Draw</Button>
        </Link>
        <Link href="/admin/winners">
          <Button>View Winners</Button>
        </Link>
      </div>
    </div>
  );
}