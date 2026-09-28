// src/app/(admin)/admin/users/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import UserRoleSelect from "@/components/admin/UserRoleSelect";
import ToggleUserStatusButton from "@/components/admin/ToggleUserStatusButton";
import UserFilters from "@/components/admin/UserFilters";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default async function UsersPage({ searchParams }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { page = "1", search = "", role = "" } = await searchParams;

  await dbConnect();

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    query.role = role;
  }

  const limit = 20;
  const skip = (parseInt(page) - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  // Merr numrin e porosive për çdo user
  const userIds = users.map((u) => u._id);
  const orderCounts = await Order.aggregate([
    { $match: { user: { $in: userIds } } },
    {
      $group: {
        _id: "$user",
        count: { $sum: 1 },
        totalSpent: { $sum: "$totalPrice" },
      },
    },
  ]);

  const orderCountMap = {};
  orderCounts.forEach((oc) => {
    orderCountMap[oc._id.toString()] = {
      count: oc.count,
      totalSpent: oc.totalSpent,
    };
  });

  const [totalCustomers, totalAdmins] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "admin" }),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Përdoruesit
        </h1>
        <p className="mt-2 text-ink-soft">
          Menaxho llogaritë e klientëve dhe adminëve
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-sand bg-paper p-4 shadow-sm">
          <p className="mb-1 text-sm text-ink-soft">Total Përdorues</p>
          <p className="text-2xl font-bold text-ink">{total}</p>
        </div>
        <div className="rounded-xl border border-sand bg-paper p-4 shadow-sm">
          <p className="mb-1 text-sm text-ink-soft">Klientë</p>
          <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
        </div>
        <div className="rounded-xl border border-sand bg-paper p-4 shadow-sm">
          <p className="mb-1 text-sm text-ink-soft">Adminë</p>
          <p className="text-2xl font-bold text-wood">{totalAdmins}</p>
        </div>
      </div>

      {/* Filters */}
      <UserFilters search={search} role={role} />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-sand bg-paper shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Përdoruesi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Roli
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Porosi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Shpenzuar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Regjistruar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {users.map((user) => {
                const stats = orderCountMap[user._id.toString()] || {
                  count: 0,
                  totalSpent: 0,
                };
                const isCurrentUser = user._id.toString() === session.user.id;

                return (
                  <tr key={user._id} className="hover:bg-sand/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wood text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-ink">
                            {user.name}{" "}
                            {isCurrentUser && (
                              <span className="text-xs text-wood">(Ti)</span>
                            )}
                          </p>
                          {user.emailVerified && (
                            <p className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Email i verifikuar
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <UserRoleSelect
                        userId={user._id.toString()}
                        currentRole={user.role}
                        disabled={isCurrentUser}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {stats.count}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-ink">
                      ${stats.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {new Date(user.createdAt).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {!isCurrentUser && (
                        <ToggleUserStatusButton userId={user._id.toString()} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between border-t border-sand px-6 py-4">
            <p className="text-sm text-ink-soft">
              Shfaqur {skip + 1}-{Math.min(skip + limit, total)} nga {total}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
