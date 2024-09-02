"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomeFormField from "../CustomeFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/action/patient.action"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constant"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);
        let formData;
        if(values.identificationDocument && values.identificationDocument.length>0){
            const blobFile = new Blob([values.identificationDocument[0]],{
                type: values.identificationDocument[0].type,

            })
            formData = new FormData();
            formData.append('blobFile',blobFile);
            formData.append('fileName',values.identificationDocument[0].name);
        }
        try {
            const patientData ={
                ...values,
                userId: user.$id,
                birthDate : new Date(values.birthDate),
                identificationDocument: formData,
            }
             //@ts-ignore   
            const patient = await registerPatient(patientData);

            if(patient) router.push(`/patient/${user.$id}/new-appoinment`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about</p>
                </section>

                <section className="mb-12 space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal information</h2>
                    </div>
                </section>
                <CustomeFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                    showTimeSelect={false}
                />
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Johndoe@gmail.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="email"
                        showTimeSelect={false}
                    />
                    <CustomeFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="phone number"
                        placeholder="077 3 456 789"
                        showTimeSelect={false}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomeFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of Birth"
                        showTimeSelect={false}
                    />
                    <CustomeFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => {
                            return <FormControl>
                                <RadioGroup className="flex h-11
                                 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    {GenderOptions.map((option) => (
                                        <div key={option} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        }}
                        showTimeSelect={false}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="14th Street, New York" showTimeSelect={false}/>
                     <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                        showTimeSelect={false}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency contact name"
                        placeholder="Gurdian's name"
                        showTimeSelect={false}
                    />
                    <CustomeFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency contact number"
                        placeholder="077 3 456 789"
                        showTimeSelect={false}
                    />
                </div>
                <section className="mb-12 space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical information</h2>
                    </div>
                </section>
                <CustomeFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="primaryPhysician"
                        label="Primary physician"
                        placeholder="Select a physician"
                        showTimeSelect={false}
                >
                    {Doctors.map((doctor)=>(
                        <SelectItem key={doctor.name} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image
                                src={doctor.image}
                                width={32}
                                height={32}
                                alt={doctor.name}
                                className="rounded-full border-dark-500"
                                />
                                <p>
                                    {doctor.name}
                                </p>
                            </div>
                        </SelectItem>

                    ))}
                </CustomeFormField>
                <div className="flex flex-col gap-6 xl:flex-row">
                <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insuaranceProvider"
                        label="Insuarance provider"
                        placeholder="BlueCross BlueShiled" 
                        showTimeSelect={false}/>
                     <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance policy number"
                        placeholder="ABC123456789"
                        showTimeSelect={false}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                <CustomeFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Penuts, Penicilin,Pollen" 
                        showTimeSelect={false}/>
                     <CustomeFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current medication (if any)"
                        placeholder="Ibuprofen 200mg,
                        Paracetamol 500mg"
                        showTimeSelect={false}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                <CustomeFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="familyMedicalHistory"
                        label="Family medical history"
                        placeholder="Mother had brain cancer, Father has heart disease" 
                        showTimeSelect={false}/>
                     <CustomeFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past medical history"
                        placeholder="Appendectomy, Tonsillectomy"
                        showTimeSelect={false}
                    />
                </div>
                <section className="mb-12 space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>
                <CustomeFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="identificationType"
                        label="Identification Type"
                        placeholder="Select an identification type"
                        showTimeSelect={false}
                >
                    {IdentificationTypes.map((type)=>(
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>

                    ))}
                </CustomeFormField>
                <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="identificationNumber"
                        label="Identification number"
                        placeholder="123456789"
                        showTimeSelect={false}
                    />
                 <CustomeFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="identificationDocument"
                        label="Scan copy of identification document"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange}/>
                            </FormControl>
                        )}
                        showTimeSelect={false}
                    />
                    <section className="mb-12 space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>
                <CustomeFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to tretement" showTimeSelect={false}                 
                />
                                <CustomeFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to disclosure of information" showTimeSelect={false}                 
                />
                                <CustomeFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I consent to privacy policy" showTimeSelect={false}                 
                />
                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    )
}
export default RegisterForm