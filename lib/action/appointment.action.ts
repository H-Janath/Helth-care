import { ID } from "node-appwrite";
import { database, ENDPOINT } from "../appwrite.config";
import { parseStringify } from "../utils";

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