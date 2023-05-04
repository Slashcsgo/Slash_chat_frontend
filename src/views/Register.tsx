import { LoginLayout } from "../components/layouts/LoginLayout";
import { RegisterForm } from "../components/controls/forms/RegisterForm";

export default function Register() {
  return <LoginLayout>
    <RegisterForm />
  </LoginLayout>
}