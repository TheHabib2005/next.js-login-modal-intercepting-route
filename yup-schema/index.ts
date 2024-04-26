import * as yup from "yup";

export const SignUpValidactionSchema = yup.object({
  username: yup.string().required("Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a  Valid Email"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "password min 5 char"),
});

export const SignInValidactionSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a  Valid Email"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "password min 5 char"),
});
