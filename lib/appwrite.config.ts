import * as sdk from 'node-appwrite';

export const {
    PROJECT_ID, 
    API_KEY, 
    DATABASE_ID, 
    PATIENT_COLLECTION_ID, 
    DOCTOR_COLLECTION_ID,
    APPOINMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT // Fixed typo here
} = process.env;

const client = new sdk.Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66bed1d40029359d05d3")
    .setKey("efe49ca52a23017a620742ff4641abe05ae9b5324d8f6b882b4dd22fa3b4d1da60a48ba6fb0810540cb930d2d58fe2cedef04a4f61b3c4aeaed43ac1a9d07545d979ea31f4d9207f7f1fc8811e3b2e465c1bb141cd58f10f4e94a347d810919710771272c6ab482d4242bf5e3a5aacd3a8630511f9b5c297b72d9f6daf38d193");

export const database = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messageing = new sdk.Messaging(client); // Commented out if Messaging does not exist
export const users = new sdk.Users(client);
