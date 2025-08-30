import { Formik, Form } from "formik";
import FormInput from "./FormInput";
import * as Yup from "yup";
import Button from "../Button/Button";
import React from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  as?: "input" | "textarea" | "select" | "radio" | "checkbox" | "date" | string;
  placeholder?: string;
  rows?: number;
  min?: number | string;
  onChange?: (e: React.ChangeEvent<unknown>) => void;
  options?: string[] | number[];
}

export interface FormikFields {
  label: string;
  name: string
  type: string
  value?: string
}

export interface ReusableFormikProps<T extends object> {
  formikFields: FormikFields[];
  onSubmit: (values: T, resetForm: () => void) => void | Promise<void>;
  children?: React.ReactNode;
  layout?: "sideBySide" | "stacked";
}

const FormikForm = ({
  formikFields,
  onSubmit,
  layout = "stacked",
}: ReusableFormikProps<T>) => {

  let validationSchema: any = {}
  let initialValues: any = {}

  const fields = formikFields?.map((datum: any)=>{
    initialValues[datum?.name] = datum?.name ? datum?.value : "";
    
    if (datum?.as && datum?.options) {
      return { name: datum?.name, label: datum?.label, type: datum?.type == "date" ? "date" : datum?.type == "time" ? "time" : "text", placeholder: `Enter ${datum?.label?.toLowerCase()}`, as: datum?.as, options: datum?.options }
    } else {
      return { name: datum?.name, label: datum?.label, type: datum?.type == "date" ? "date" : datum?.type == "time" ? "time" : "text", placeholder: `Enter ${datum?.label?.toLowerCase()}` }
    }
  })

  formikFields?.forEach((datum: any)=>{
    
    if (datum?.type == "text") {
      validationSchema[datum?.name] = Yup.string().matches(/^[A-Za-z ]+$/, `${datum?.label?.toString()} must only contain letters`).required(`${datum?.label} is required`)
    } else if (datum?.type == "textNum") {
      validationSchema[datum?.name] = Yup.string().required(`${datum?.label} is required`)
    } else if (datum?.type == "email") {
      validationSchema[datum?.name] = Yup.string().email(`Invalid ${datum?.label?.toString()}`).required(`${datum?.label} is required`)
    } else if (datum?.type == "password") {
      validationSchema[datum?.name] = Yup.string().min(6, `${datum?.label} must be at least 6 characters long`).required(`${datum?.label} is required`)
    } else if (datum?.type == "phone") {
      validationSchema[datum?.name] = Yup.string().matches(/^[0-9]{10}$/, `${datum?.label} must be exactly 10 digits`).required(`${datum?.label} is required`)
    } else if (datum?.type == "otp") {
      validationSchema[datum?.name] = Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits')
    } else if (datum?.type == "confirmPassword") {
      validationSchema[datum?.name] = Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Please confirm your password')
    } else if (datum?.type == "dob") {
      validationSchema[datum?.name] = Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD format").required("Date of Birth is required")
    } else if (datum?.type == "date") {
      validationSchema[datum?.name] = Yup.string().required("Date is required")
    } else if (datum?.type == "time") {
      validationSchema[datum?.name] = Yup.string().required("Time is required")
    }

  })

  const containerClass =
    layout === "sideBySide"
      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
      : "flex flex-col space-y-4";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object(validationSchema)}
      onSubmit={(values, formikHelpers) => {
        onSubmit(values, formikHelpers.resetForm);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="max-w-4xl w-full bg-white p-6 rounded-md mx-auto flex flex-col">
          <div className={`${containerClass} overflow-y-auto`} style={{ maxHeight: "60vh" }}>
            {fields.map((field: any) => (
              <div
                key={field?.name}
                className={
                  layout === "sideBySide" && field.as === "textarea"
                    ? "md:col-span-2 w-full"
                    : "w-full"
                }
              >
                <FormInput {...field} />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="bg-blue-600 text-white py-2 px-8 rounded-md hover:bg-blue-700 transition mt-6 mx-auto block"
            disabled={isSubmitting}
            // onClick={()=>setTimeout(()=>isSubmitting && document.getElementById('modal-close')?.click(), 200)}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormikForm;