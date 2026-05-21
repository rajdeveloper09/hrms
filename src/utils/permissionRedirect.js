export const getDefaultRedirect = () => {
  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  if (role === "superAdmin") return "/dashboard";

  const dashboard = permissions.find(
    (p) => p.route_path === "/dashboard" && Number(p.can_view) === 1
  );

  if (dashboard) return "/dashboard";

  const firstAllowed = permissions.find((p) => Number(p.can_view) === 1);

  return firstAllowed?.route_path || "/login";
};