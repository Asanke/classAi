export type UserRole = "super_admin" | "admin" | "teacher" | "parent" | "student";

export interface UserProfile {
    uid: string;
    email: string;
    role: UserRole;
    instituteId: string; // "global" for super_admin or generic platform users
    displayName?: string;
    metadata?: Record<string, any>;
}

export const ROLES: Record<string, UserRole> = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin", // Institute Admin
    TEACHER: "teacher",
    PARENT: "parent",
    STUDENT: "student",
};

export function hasPermission(user: UserProfile, requiredRole: UserRole): boolean {
    if (user.role === "super_admin") return true;
    if (user.role === "admin") {
        return ["teacher", "parent", "student"].includes(requiredRole) || requiredRole === "admin";
    }
    return user.role === requiredRole;
}
