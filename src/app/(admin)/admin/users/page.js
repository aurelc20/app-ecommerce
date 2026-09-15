// src/app/(admin)/admin/users/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import UserRoleSelect from "@/components/admin/UserRoleSelect";
import ToggleUserStatusButton from "@/components/admin/ToggleUserStatusButton";
import UserFilters from "@/components/admin/UserFilters";

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
        <h1 className="text-3xl font-bold text-gray-900">Përdoruesit</h1>
        <p className="text-gray-600 mt-2">
          Menaxho llogaritë e klientëve dhe adminëve
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-1">Total Përdorues</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-1">Klientë</p>
          <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-1">Adminë</p>
          <p className="text-2xl font-bold text-purple-600">{totalAdmins}</p>
        </div>
      </div>

      {/* Filters */}
      <UserFilters search={search} role={role} />
      {/* <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Kërko me emër ose email..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const url = new URL(window.location);
                url.searchParams.set("search", e.target.value);
                url.searchParams.delete("page");
                window.location.href = url.toString();
              }
            }}
            className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />

          <select
            defaultValue={role}
            onChange={(e) => {
              const url = new URL(window.location);
              if (e.target.value) {
                url.searchParams.set("role", e.target.value);
              } else {
                url.searchParams.delete("role");
              }
              url.searchParams.delete("page");
              window.location.href = url.toString();
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Të gjithë rolet</option>
            <option value="customer">Klient</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
          </select>
        </div>
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Përdoruesi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Roli
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Porosi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Shpenzuar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Regjistruar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => {
                const stats = orderCountMap[user._id.toString()] || {
                  count: 0,
                  totalSpent: 0,
                };
                const isCurrentUser = user._id.toString() === session.user.id;

                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}{" "}
                            {isCurrentUser && (
                              <span className="text-xs text-purple-600">
                                (Ti)
                              </span>
                            )}
                          </p>
                          {user.emailVerified && (
                            <p className="text-xs text-green-600">
                              ✓ Email i verifikuar
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <UserRoleSelect
                        userId={user._id.toString()}
                        currentRole={user.role}
                        disabled={isCurrentUser}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {stats.count}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${stats.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
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
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Shfaqur {skip + 1}-{Math.min(skip + limit, total)} nga {total}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
