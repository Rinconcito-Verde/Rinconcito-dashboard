import ChangePasswordForm from "./ChangePassword"
import DeleteUserForm from "./DeleteUser"
import RegisterForm from "./Register"

export function Settings(){

    return(
        <>
        <h1>Administrador de cuentas</h1>
        <ChangePasswordForm />
        <RegisterForm />
        <DeleteUserForm/>
        </>

    )
}