"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  ShieldAlert,
  Search,
  Download,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Activity,
  FileText,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  X,
  Eye,
  Info,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "super_admin";
  createdAt: string;
  lastSignInAt?: string;
}

interface Registration {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  organization?: string;
  attendance_type: "in-person" | "livestream";
  status: "pending" | "confirmed" | "cancelled";
  amount_lkr: number;
  created_at: string;
  payments?: Array<{
    id: string;
    reference: string;
    amount_lkr: number;
    status: string;
    created_at: string;
  }>;
}

interface OverviewMetrics {
  totalRegistrations: number;
  inPersonRegistrations: number;
  livestreamRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  cancelledRegistrations: number;
  totalRevenueLkr: number;
  completedPaymentsCount: number;
  failedPaymentsCount: number;
  totalUsers: number;
  adminCount: number;
}

interface SystemLog {
  id: number;
  level: "info" | "warn" | "error";
  event: string;
  message: string;
  payment_id?: string;
  registration_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface AdminDashboardProps {
  currentUser: {
    id: string;
    email: string;
    role: "user" | "admin" | "super_admin";
  };
}

type TabType = "overview" | "registrations" | "users" | "logs";

export default function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Overview Data
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);

  // Registrations Data
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchReg, setSearchReg] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingRegId, setUpdatingRegId] = useState<string | null>(null);

  // Confirmation Modal State for Status Override
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    reg: Registration;
    targetStatus: "pending" | "confirmed" | "cancelled";
  } | null>(null);

  // Users Data
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Logs Data & Filters
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [searchLog, setSearchLog] = useState("");
  const [filterLogLevel, setFilterLogLevel] = useState<string>("all");
  const [filterLogEvent, setFilterLogEvent] = useState<string>("all");
  const [selectedLogDetail, setSelectedLogDetail] = useState<SystemLog | null>(null);

  // Fetch functions
  async function fetchOverview() {
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setRecentRegistrations(data.recentRegistrations);
      }
    } catch (err) {
      console.error("Failed to load overview:", err);
    }
  }

  async function fetchRegistrations() {
    try {
      const query = new URLSearchParams();
      if (filterType !== "all") query.set("attendanceType", filterType);
      if (filterStatus !== "all") query.set("status", filterStatus);
      if (searchReg) query.set("search", searchReg);

      const res = await fetch(`/api/admin/registrations?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error("Failed to load registrations:", err);
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/roles");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }

  async function fetchLogs() {
    try {
      const query = new URLSearchParams();
      if (filterLogLevel !== "all") query.set("level", filterLogLevel);
      if (filterLogEvent !== "all") query.set("event", filterLogEvent);
      if (searchLog) query.set("search", searchLog);

      const res = await fetch(`/api/admin/logs?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    }
  }

  async function reloadAll() {
    setLoading(true);
    await Promise.all([fetchOverview(), fetchRegistrations(), fetchUsers(), fetchLogs()]);
    setLoading(false);
  }

  useEffect(() => {
    reloadAll();
  }, []);

  // Triggered when admin confirms status change in modal
  async function confirmStatusChange() {
    if (!pendingStatusChange) return;

    const { reg, targetStatus } = pendingStatusChange;
    setUpdatingRegId(reg.id);

    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: reg.id, status: targetStatus }),
      });

      if (res.ok) {
        setActionMessage({
          type: "success",
          text: `Status for ${reg.first_name} ${reg.last_name} changed from '${reg.status}' to '${targetStatus}'. Action logged.`,
        });
        setRegistrations((prev) =>
          prev.map((r) => (r.id === reg.id ? { ...r, status: targetStatus } : r))
        );
        // Refresh overview and logs to immediately display the new audit trail record
        fetchOverview();
        fetchLogs();
      } else {
        const err = await res.json();
        setActionMessage({ type: "error", text: err.error || "Failed to update registration status." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Network error updating status." });
    } finally {
      setUpdatingRegId(null);
      setPendingStatusChange(null);
      setTimeout(() => setActionMessage(null), 5000);
    }
  }

  // Update user role
  async function handleUpdateRole(userId: string, newRole: "user" | "admin" | "super_admin") {
    setUpdatingUserId(userId);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setActionMessage({ type: "success", text: `User role changed to ${newRole}. Action logged.` });
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        fetchLogs();
      } else {
        const err = await res.json();
        setActionMessage({ type: "error", text: err.error || "Failed to update role." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Network error updating role." });
    } finally {
      setUpdatingUserId(null);
      setTimeout(() => setActionMessage(null), 4000);
    }
  }

  // Export registrations as CSV
  function exportCSV() {
    if (!registrations.length) return;

    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Organization",
      "Attendance Type",
      "Status",
      "Amount LKR",
      "Created At",
    ];

    const rows = registrations.map((r) => [
      r.id,
      `"${r.first_name}"`,
      `"${r.last_name}"`,
      `"${r.email}"`,
      `"${r.organization || ""}"`,
      r.attendance_type,
      r.status,
      r.amount_lkr,
      r.created_at,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dwmtf_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      const matchSearch =
        searchReg === "" ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchReg.toLowerCase()) ||
        r.email.toLowerCase().includes(searchReg.toLowerCase()) ||
        (r.organization && r.organization.toLowerCase().includes(searchReg.toLowerCase())) ||
        r.id.toLowerCase().includes(searchReg.toLowerCase());

      const matchType = filterType === "all" || r.attendance_type === filterType;
      const matchStatus = filterStatus === "all" || r.status === filterStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [registrations, searchReg, filterType, filterStatus]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchUser.toLowerCase();
      return (
        u.email.toLowerCase().includes(term) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term)
      );
    });
  }, [users, searchUser]);

  // Unique list of events in logs for filter dropdown
  const uniqueLogEvents = useMemo(() => {
    const defaultEvents = [
      "ADMIN_STATUS_OVERRIDE",
      "ADMIN_REGISTRATION_UPDATE",
      "ADMIN_ROLE_CHANGE",
      "AUTH_LOGIN",
      "AUTH_REGISTER",
      "PAYMENT_INITIATED",
      "PAYMENT_STATUS_CHECK",
      "PAYMENT_CALLBACK_UPDATE",
    ];
    const logEvents = logs.map((l) => l.event).filter(Boolean);
    return Array.from(new Set([...defaultEvents, ...logEvents]));
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchLevel = filterLogLevel === "all" || log.level === filterLogLevel;
      const matchEvent = filterLogEvent === "all" || log.event === filterLogEvent;

      const term = searchLog.toLowerCase();
      const matchSearch =
        searchLog === "" ||
        log.event?.toLowerCase().includes(term) ||
        log.message?.toLowerCase().includes(term) ||
        log.ip_address?.toLowerCase().includes(term) ||
        log.registration_id?.toLowerCase().includes(term) ||
        log.payment_id?.toLowerCase().includes(term) ||
        JSON.stringify(log.metadata || {}).toLowerCase().includes(term);

      return matchLevel && matchEvent && matchSearch;
    });
  }, [logs, filterLogLevel, filterLogEvent, searchLog]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-deep/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal/15 text-deep">
              <Shield className="h-3.5 w-3.5 text-teal" />
              Role: {currentUser.role}
            </span>
            <span className="text-xs text-deep/50">{currentUser.email}</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-deep mt-2">
            Congress Admin Console
          </h1>
          <p className="text-sm text-deep/60 mt-1">
            Manage registrations, verify ticket payments, inspect audit logs, and administer role-based access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={reloadAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          {activeTab === "registrations" && (
            <Button
              variant="primary"
              onClick={exportCSV}
              className="flex items-center gap-2 px-5 py-2 text-sm"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-3 transition-all ${
            actionMessage.type === "success"
              ? "bg-teal/15 text-deep border border-teal/30"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-teal shrink-0" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-deep/[0.04] rounded-2xl border border-deep/10">
        {[
          { id: "overview", label: "Overview & Analytics", icon: TrendingUp },
          { id: "registrations", label: `Registrations (${registrations.length})`, icon: Users },
          { id: "users", label: `User Roles (${users.length})`, icon: UserCheck },
          { id: "logs", label: `Audit Logs (${logs.length})`, icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-deep shadow-sm border border-deep/10 font-semibold"
                  : "text-deep/70 hover:text-deep hover:bg-white/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-teal" : "text-deep/40"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-deep/60 uppercase tracking-wider">
                  Total Registrations
                </span>
                <div className="p-2.5 rounded-xl bg-deep/[0.06] text-deep">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-deep mt-3">
                {metrics?.totalRegistrations ?? "—"}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-deep/60">
                <span>In-person: <b className="text-deep">{metrics?.inPersonRegistrations ?? 0}</b></span>
                <span>•</span>
                <span>Livestream: <b className="text-deep">{metrics?.livestreamRegistrations ?? 0}</b></span>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-deep/60 uppercase tracking-wider">
                  Confirmed Attendees
                </span>
                <div className="p-2.5 rounded-xl bg-teal/15 text-teal">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-deep mt-3">
                {metrics?.confirmedRegistrations ?? "—"}
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-deep/60">
                <span>Pending: <b className="text-amber-600">{metrics?.pendingRegistrations ?? 0}</b></span>
                <span>•</span>
                <span>Cancelled: <b className="text-red-500">{metrics?.cancelledRegistrations ?? 0}</b></span>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-deep/60 uppercase tracking-wider">
                  Total Revenue
                </span>
                <div className="p-2.5 rounded-xl bg-teal/20 text-deep">
                  <CreditCard className="h-5 w-5 text-teal" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-deep mt-3">
                LKR {(metrics?.totalRevenueLkr ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-deep/60 mt-3">
                {metrics?.completedPaymentsCount ?? 0} completed transactions
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-deep/60 uppercase tracking-wider">
                  Accounts & Admins
                </span>
                <div className="p-2.5 rounded-xl bg-deep/[0.06] text-deep">
                  <Shield className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-deep mt-3">
                {metrics?.totalUsers ?? "—"}
              </p>
              <p className="text-xs text-deep/60 mt-3">
                <b className="text-teal">{metrics?.adminCount ?? 0}</b> administrator account(s)
              </p>
            </GlassCard>
          </div>

          {/* Breakdown & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Attendance breakdown */}
            <GlassCard className="p-6 space-y-5">
              <h3 className="font-display font-semibold text-lg text-deep">
                Attendance Distribution
              </h3>
              {metrics && metrics.totalRegistrations > 0 ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-deep">In-Person Delegate Pass</span>
                      <span className="text-deep/70">
                        {metrics.inPersonRegistrations} (
                        {Math.round((metrics.inPersonRegistrations / metrics.totalRegistrations) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-deep/[0.08] h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-deep h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(metrics.inPersonRegistrations / metrics.totalRegistrations) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-deep">Global Livestream Pass</span>
                      <span className="text-deep/70">
                        {metrics.livestreamRegistrations} (
                        {Math.round((metrics.livestreamRegistrations / metrics.totalRegistrations) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-deep/[0.08] h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-teal h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(metrics.livestreamRegistrations / metrics.totalRegistrations) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-deep/50 py-4">No registration data recorded yet.</p>
              )}
            </GlassCard>

            {/* Recent Registrations Preview */}
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg text-deep">
                  Recent Registrations
                </h3>
                <button
                  onClick={() => setActiveTab("registrations")}
                  className="text-xs text-teal hover:underline font-medium"
                >
                  View all
                </button>
              </div>

              {recentRegistrations.length === 0 ? (
                <p className="text-sm text-deep/50 py-4">No registrations yet.</p>
              ) : (
                <div className="divide-y divide-deep/10">
                  {recentRegistrations.slice(0, 5).map((reg) => (
                    <div key={reg.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-deep">
                          {reg.first_name} {reg.last_name}
                        </p>
                        <p className="text-xs text-deep/60">{reg.email}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            reg.status === "confirmed"
                              ? "bg-teal/15 text-teal"
                              : reg.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {reg.status}
                        </span>
                        <p className="text-xs text-deep/50 mt-1 capitalize">
                          {reg.attendance_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {/* Tab 2: REGISTRATIONS MANAGEMENT */}
      {activeTab === "registrations" && (
        <GlassCard className="p-6 space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
              <input
                type="text"
                placeholder="Search by name, email, org, ID..."
                value={searchReg}
                onChange={(e) => setSearchReg(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-paper rounded-xl border border-deep/15 text-sm text-deep placeholder:text-deep/40 focus:outline-none focus:border-deep"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-paper rounded-xl border border-deep/15 text-sm text-deep focus:outline-none focus:border-deep"
              >
                <option value="all">All Ticket Types</option>
                <option value="in-person">In-Person</option>
                <option value="livestream">Livestream</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-paper rounded-xl border border-deep/15 text-sm text-deep focus:outline-none focus:border-deep"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="overflow-x-auto rounded-xl border border-deep/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-deep/[0.03] text-xs font-semibold text-deep/70 uppercase border-b border-deep/10">
                <tr>
                  <th className="px-4 py-3.5">Attendee</th>
                  <th className="px-4 py-3.5">Organization</th>
                  <th className="px-4 py-3.5">Ticket Type</th>
                  <th className="px-4 py-3.5">Amount (LKR)</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Created</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep/5">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-deep/50">
                      No registrations match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-deep/[0.015] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-deep">
                          {reg.first_name} {reg.last_name}
                        </div>
                        <div className="text-xs text-deep/60">{reg.email}</div>
                        <div className="text-[10px] text-deep/40 font-mono mt-0.5 truncate max-w-[150px]">
                          ID: {reg.id}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-deep/80">
                        {reg.organization || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reg.attendance_type === "in-person"
                              ? "bg-deep/10 text-deep"
                              : "bg-teal/15 text-teal"
                          }`}
                        >
                          {reg.attendance_type === "in-person" ? "In-Person" : "Livestream"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-deep">
                        {Number(reg.amount_lkr).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            reg.status === "confirmed"
                              ? "bg-teal/15 text-teal"
                              : reg.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-deep/60 whitespace-nowrap">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <select
                          disabled={updatingRegId === reg.id}
                          value={reg.status}
                          onChange={(e) =>
                            setPendingStatusChange({
                              reg,
                              targetStatus: e.target.value as "pending" | "confirmed" | "cancelled",
                            })
                          }
                          className="text-xs bg-paper border border-deep/20 rounded-lg px-2 py-1 font-medium text-deep focus:outline-none cursor-pointer hover:border-deep"
                        >
                          <option value="pending">Set Pending</option>
                          <option value="confirmed">Set Confirmed</option>
                          <option value="cancelled">Set Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Confirmation Modal for Registration Status Override */}
      {pendingStatusChange && (
        <div className="fixed inset-0 z-50 bg-deep/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-deep/15 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-deep">
                    Confirm Status Change
                  </h3>
                  <p className="text-xs text-red-600 font-semibold uppercase tracking-wider">
                    Irreversible Action
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPendingStatusChange(null)}
                className="text-deep/40 hover:text-deep p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-deep/[0.03] border border-deep/10 rounded-2xl p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-deep/60">Attendee:</span>
                <span className="font-semibold text-deep">
                  {pendingStatusChange.reg.first_name} {pendingStatusChange.reg.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-deep/60">Email:</span>
                <span className="font-mono text-xs text-deep">{pendingStatusChange.reg.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-deep/60">Ticket:</span>
                <span className="capitalize text-deep">{pendingStatusChange.reg.attendance_type}</span>
              </div>
              <div className="border-t border-deep/10 pt-2 flex items-center justify-between">
                <span className="text-deep/60">Transition:</span>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="capitalize px-2 py-0.5 rounded bg-deep/10 text-deep text-xs">
                    {pendingStatusChange.reg.status}
                  </span>
                  <span>➔</span>
                  <span
                    className={`capitalize px-2 py-0.5 rounded text-xs ${
                      pendingStatusChange.targetStatus === "confirmed"
                        ? "bg-teal/20 text-teal"
                        : pendingStatusChange.targetStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {pendingStatusChange.targetStatus}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-deep/70 leading-relaxed">
              Are you sure you want to proceed? This will immediately alter the attendee&apos;s ticket status.
              An <strong>immutable audit log entry</strong> will be recorded under your administrator account (
              <span className="font-mono text-deep font-semibold">{currentUser.email}</span>).
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setPendingStatusChange(null)}
                className="px-5 py-2.5 text-sm"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={updatingRegId !== null}
                onClick={confirmStatusChange}
                className="px-6 py-2.5 text-sm bg-deep hover:bg-deep/90 text-white"
              >
                {updatingRegId ? "Applying..." : "Yes, Confirm Status Change"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: USER ROLES & ACCESS CONTROL */}
      {activeTab === "users" && (
        <GlassCard className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div>
              <h3 className="font-display font-semibold text-lg text-deep">
                User Role Administration
              </h3>
              <p className="text-xs text-deep/60">
                Grant or revoke administrative permissions. Changes take effect immediately and are logged.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-paper rounded-xl border border-deep/15 text-sm text-deep placeholder:text-deep/40 focus:outline-none focus:border-deep"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-deep/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-deep/[0.03] text-xs font-semibold text-deep/70 uppercase border-b border-deep/10">
                <tr>
                  <th className="px-4 py-3.5">User Email</th>
                  <th className="px-4 py-3.5">Name</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Registered</th>
                  <th className="px-4 py-3.5">Last Sign In</th>
                  <th className="px-4 py-3.5 text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-deep/50">
                      No user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-deep/[0.015] transition-colors">
                      <td className="px-4 py-3.5 font-medium text-deep">
                        {u.email}
                        {u.id === currentUser.id && (
                          <span className="ml-2 text-[10px] bg-deep/10 text-deep px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-deep/80">
                        {u.firstName || u.lastName ? `${u.firstName} ${u.lastName}` : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                            u.role === "super_admin"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "admin"
                              ? "bg-teal/20 text-teal"
                              : "bg-deep/[0.06] text-deep/70"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-deep/60">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-deep/60">
                        {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleString() : "Never"}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <select
                          disabled={updatingUserId === u.id || (u.role === "super_admin" && currentUser.role !== "super_admin")}
                          value={u.role}
                          onChange={(e) =>
                            handleUpdateRole(u.id, e.target.value as "user" | "admin" | "super_admin")
                          }
                          className="text-xs bg-paper border border-deep/20 rounded-lg px-2.5 py-1 font-medium text-deep focus:outline-none cursor-pointer hover:border-deep"
                        >
                          <option value="user">User (Default)</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab 4: AUDIT LOGS WITH RICH FILTERS */}
      {activeTab === "logs" && (
        <GlassCard className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-deep">
                System & Payment Audit Logs
              </h3>
              <p className="text-xs text-deep/60">
                Immutable audit trail of authentication attempts, administrative overrides, and payment operations.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={fetchLogs}
              className="flex items-center gap-2 px-3 py-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Logs
            </Button>
          </div>

          {/* Audit Logs Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-deep/[0.02] p-3.5 rounded-2xl border border-deep/10">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
              <input
                type="text"
                placeholder="Search logs by message, event, IP, ID, or JSON..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-paper rounded-xl border border-deep/15 text-xs text-deep placeholder:text-deep/40 focus:outline-none focus:border-deep"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Event Type Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-deep/60 whitespace-nowrap">Event:</span>
                <select
                  value={filterLogEvent}
                  onChange={(e) => setFilterLogEvent(e.target.value)}
                  className="px-3 py-2 bg-paper rounded-xl border border-deep/15 text-xs text-deep focus:outline-none"
                >
                  <option value="all">All Events</option>
                  {uniqueLogEvents.map((evt) => (
                    <option key={evt} value={evt}>
                      {evt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity Level Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-deep/60 whitespace-nowrap">Level:</span>
                <select
                  value={filterLogLevel}
                  onChange={(e) => setFilterLogLevel(e.target.value)}
                  className="px-3 py-2 bg-paper rounded-xl border border-deep/15 text-xs text-deep focus:outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="info">Info</option>
                  <option value="warn">Warnings</option>
                  <option value="error">Errors</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto rounded-xl border border-deep/10 bg-white">
            <table className="w-full text-left text-sm font-mono">
              <thead className="bg-deep/[0.03] text-xs uppercase border-b border-deep/10 font-sans font-semibold text-deep/70">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep/5 text-xs">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-deep/50 font-sans">
                      No audit logs match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-deep/[0.015] transition-colors">
                      <td className="px-4 py-3 text-deep/60 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.level === "error"
                              ? "bg-red-100 text-red-700"
                              : log.level === "warn"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-teal/15 text-teal"
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-deep font-mono">{log.event}</td>
                      <td className="px-4 py-3 text-deep/80 max-w-md truncate font-sans">{log.message}</td>
                      <td className="px-4 py-3 text-deep/60">{log.ip_address || "—"}</td>
                      <td className="px-4 py-3 text-right font-sans">
                        <button
                          onClick={() => setSelectedLogDetail(log)}
                          className="inline-flex items-center gap-1 text-xs text-teal hover:underline font-medium"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Log Details Modal */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 bg-deep/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-deep/15 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex px-2.5 py-1 rounded text-xs font-bold uppercase ${
                    selectedLogDetail.level === "error"
                      ? "bg-red-100 text-red-700"
                      : selectedLogDetail.level === "warn"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-teal/15 text-teal"
                  }`}
                >
                  {selectedLogDetail.level}
                </span>
                <h3 className="font-mono font-bold text-base text-deep">
                  {selectedLogDetail.event}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="text-deep/40 hover:text-deep p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-deep/[0.03] rounded-xl text-deep">
                <span className="font-semibold text-deep/70 block mb-1">Message:</span>
                <p className="font-sans text-sm">{selectedLogDetail.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-deep/80">
                <div className="p-3 bg-deep/[0.03] rounded-xl">
                  <span className="text-deep/60 block">Timestamp:</span>
                  <span className="font-mono">{new Date(selectedLogDetail.created_at).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-deep/[0.03] rounded-xl">
                  <span className="text-deep/60 block">IP Address:</span>
                  <span className="font-mono">{selectedLogDetail.ip_address || "—"}</span>
                </div>
                {selectedLogDetail.registration_id && (
                  <div className="p-3 bg-deep/[0.03] rounded-xl col-span-2">
                    <span className="text-deep/60 block">Registration ID:</span>
                    <span className="font-mono">{selectedLogDetail.registration_id}</span>
                  </div>
                )}
                {selectedLogDetail.payment_id && (
                  <div className="p-3 bg-deep/[0.03] rounded-xl col-span-2">
                    <span className="text-deep/60 block">Payment ID:</span>
                    <span className="font-mono">{selectedLogDetail.payment_id}</span>
                  </div>
                )}
              </div>

              {selectedLogDetail.metadata && (
                <div className="space-y-1">
                  <span className="font-semibold text-deep/70 block">Metadata JSON:</span>
                  <pre className="p-4 bg-deep/[0.04] rounded-xl font-mono text-[11px] overflow-x-auto text-deep/90 border border-deep/10">
                    {JSON.stringify(selectedLogDetail.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                onClick={() => setSelectedLogDetail(null)}
                className="px-5 py-2 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
