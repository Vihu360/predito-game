'use client';

import { useAdminGuard } from "@/lib/adminGuard";

export default function AdminPage() {
  const { isAdmin, isLoading } = useAdminGuard();

  console.log("is admin",isAdmin);
  console.log(isLoading);

  if (isLoading === true) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black ">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    )
  }
  if (!isAdmin) return null;

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin content */}
    </div>
  );
}