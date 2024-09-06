"use server";
import { ID, Query } from "node-appwrite";
import { database } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { CreateAppointmentParams,UpdateAppointmentParams } from "@/types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (appointment: CreateAppointmentParams)=>{
    try {
        const newAppointment = await database.createDocument(
            "66bed3020013abcab0b1"!,
            "66bed3a300293769aefc"!,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await database.getDocument(
            "66bed3020013abcab0b1"!,
            "66bed3a300293769aefc"!,
            appointmentId,
        )
        return parseStringify(appointment);
    } catch (error) {
        console.log(error);
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await database.listDocuments(
            '66bed3020013abcab0b1',
            '66bed3a300293769aefc',
            [Query.orderDesc('$createdAt')]
        );

        const initialCount = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };

        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case 'scheduled':
                        acc.scheduledCount += 1;
                        break;
                    case 'pending':
                        acc.pendingCount += 1;
                        break;
                    case 'cancelled':
                        acc.cancelledCount += 1;
                        break;
                }
                return acc;
            },
            initialCount
        );

        const data ={
            totlaCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
      

        return parseStringify(data);
    } catch (error) {
        console.error('Error fetching recent appointments:', error);
        return null; // Optionally return a default value or handle the error differently
    }
};
export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    console.log(appointment)
    try {
        const updatedAppointment = await database.updateDocument(
            '66bed3020013abcab0b1', // Replace with your database ID
            '66bed3a300293769aefc', // Replace with your collection ID
            appointmentId,
            appointment
        );

        if (!updatedAppointment) {
            throw new Error("Appointment not found");
        }

        // Assuming revalidatePath is an async function
        revalidatePath('/admin');

        // Returning the parsed appointment data
        return parseStringify(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
    }
};
