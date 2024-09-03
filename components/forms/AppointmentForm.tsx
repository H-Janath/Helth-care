"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomeFormField from "../CustomeFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constant"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment } from "@/lib/action/appointment.action"



const AppointmentForm = ({
  userId, patientId, type
}: {
  userId: string,
  patientId: string,
  type: "create" | "cancel" | "schedule";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const AppointmentFormValidation = getAppointmentSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CreateAppointmentSchema>) {
    setIsLoading(true);
    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled'
        break;
      default:
        status = 'pending'
        break;
    }
    try {
      if (type === 'create' && patientId) {
        const appoinmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        }
        const appointment = await createAppointment(appoinmentData);
        if (appointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appoinment/success?appointmentId=${appointment.$id}`)
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'create':
      buttonLabel = 'Create Appointment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment'
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Request a new appoinment in 10 seconds</p>
        </section>
        {type !== "cancel" && (
          <>
            <CustomeFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
              showTimeSelect={false}
            >
              {Doctors.map((doctor) => (
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
            <CustomeFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appoinment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomeFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reson for appoinment"
                placeholder="Enter reason for appoinment"
                showTimeSelect={false} />
              <CustomeFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter notes"
                showTimeSelect={false} />
            </div>

          </>
        )}
        {type === "cancel" && (
          <CustomeFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReson"
            label="Reson for cancellation"
            placeholder="Enter reson for cancellation"
            showTimeSelect={false} />
        )}

        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ?
          'shad-danger-btn' : 'shad-primary-btn'} w-full`}>
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}
export default AppointmentForm;
