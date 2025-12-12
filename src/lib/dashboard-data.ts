import { db } from "./firebase";
import { collection, query, where, getDocs, getCountFromServer, Timestamp } from "firebase/firestore";

export interface DashboardStats {
    activeStudents: number;
    todayAttendance: number;
    todayIncome: number;
    arrears: number;
}

export async function getDashboardStats(instituteId: string): Promise<DashboardStats> {
    if (!instituteId) return { activeStudents: 0, todayAttendance: 0, todayIncome: 0, arrears: 0 };

    try {
        // 1. Active Students
        const studentsColl = collection(db, `institutes/${instituteId}/students`);
        const activeStudentsSnapshot = await getCountFromServer(query(studentsColl, where("status", "==", "active")));
        const activeStudents = activeStudentsSnapshot.data().count;

        // 2. Today's Attendance
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendanceColl = collection(db, `institutes/${instituteId}/attendance`);
        // Note: Firestore timestamps need careful handling. Assuming 'date' is a stored Timestamp or ISO string.
        // For simplicity using client-side filtering if simpler or simplified query.
        // Real implementation would use Timestamp range for "today".
        const startOfDay = Timestamp.fromDate(today);
        const endOfDay = Timestamp.fromDate(new Date(today.getTime() + 86400000));

        const attendanceSnapshot = await getCountFromServer(query(
            attendanceColl,
            where("date", ">=", startOfDay),
            where("date", "<", endOfDay),
            where("status", "==", "present")
        ));
        const todayAttendance = attendanceSnapshot.data().count;

        // 3. Today's Income
        const paymentsColl = collection(db, `institutes/${instituteId}/payments`);
        const paymentsQuery = query(
            paymentsColl,
            where("createdAt", ">=", startOfDay),
            where("createdAt", "<", endOfDay)
        );
        const paymentsDocs = await getDocs(paymentsQuery);
        let todayIncome = 0;
        paymentsDocs.forEach(doc => {
            todayIncome += (doc.data().amount || 0);
        });

        // 4. Arrears (Simplified: just a stored field or sum of unpaid)
        // Assuming 'students' have an 'arrears' field which is efficient to sum.
        // If not, we'd query all students with arrears > 0.
        const arrearsQuery = query(studentsColl, where("arrears", ">", 0));
        const arrearsDocs = await getDocs(arrearsQuery);
        let arrears = 0;
        arrearsDocs.forEach(doc => {
            arrears += (doc.data().arrears || 0);
        });

        return {
            activeStudents,
            todayAttendance,
            todayIncome,
            arrears
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { activeStudents: 0, todayAttendance: 0, todayIncome: 0, arrears: 0 };
    }
}
