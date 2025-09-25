import { Role, Status } from "@/utils/enums";
import { MockData } from "@/utils/mock-data";
import { MsisdnRegex, PasswordRegex } from "@/utils/utils";


export const UserSchema = Yup.object({
    id: Yup.number().integer().optional().default(0),
    name: Yup.string().required("Name is required").min(2, "Please provide a valid name").default(""),
    email: Yup.string().email("Invalid email").required("Email is required").default(""),
    msisdn: Yup.string().matches(MsisdnRegex, "Invalid phone number").optional().default(""),
    createdAt: Yup.string().optional().default(MockData.date),
    lastLoginDate: Yup.string().optional().default(MockData.date),
    lastPasswordChangeDate: Yup.string().optional().default(MockData.date),
    status: Yup.string().optional().default(Status.DEFAULT),
    role: Yup.string().required("Role is required").default(Role.USER)
});

export const RegistrationSchema = Yup.object({
    name: Yup.string().min(2, "Invalid name").required("name is required"),
    email: Yup.string().email("Invalid email address").required("Email address is required"),
    password: Yup.string().matches(PasswordRegex, "Weak Password. Required 1 digit, 1 capital, 1 special character").min(6, "Short Password").required("password is required"),
    confirmedPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords do not match").required("Please confirm your password"),
    acceptTermsAndConditions: Yup.boolean().required().default(false)
});

export const PasswordChangeSchema = Yup.object({
    id: Yup.number().integer().optional(),
    password: Yup.string().matches(PasswordRegex, "Weak Password, (At least 1 digit, 1 capital letter and 1 symbol)").required("Password is required"),
    currentPassword: Yup.string().optional(),
    confirmedPassword: Yup.string().required("Please confirm password").oneOf([Yup.ref("password")], "Passwords do not match")
});



export default UserSchema;
