import { useMutation } from "@apollo/client";
import { FunctionComponent, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { emailPattern } from "../../../helpers/ValidationPatterns";
import { Submit } from "../buttons/Submit";
import { PasswordInput } from "../inputs/PasswordInput";
import { TextInput } from "../inputs/TextInput";
import RegisterSchema from "../../../api/schemas/Register.graphql"
import { useNavigate } from "react-router-dom"
import { hash } from "../../../helpers/Hash";


type Errors = {
  email?: string,
  password?: string,
  name?: string
}

interface IObject<T> {
  [index: string]: T | undefined
}

export const RegisterForm: FunctionComponent = () => {
  const { register, handleSubmit} = useForm()
  const [errors, setErrors] = useState<Errors>({})
  const [mainError, setMainError] = useState<String>()

  const [registerUser] = useMutation(RegisterSchema)

  const navigate = useNavigate()

  const onSuccess: SubmitHandler<FieldValues> = async (formData) => {
    const password = await hash(formData.password)
    console.log(password)
    setErrors({})
    registerUser({
      variables: {
        email: formData.email,
        password: password,
        name: formData.name
      }
    }).then(result => {
      if (result && result.data && result.data.addUser) {
        const payload = result.data.addUser
        if (payload.error && payload.error.code) {
          setMainError("Неопознанная ошибка, попробуйте позже")
        } else if (payload.success) {
          navigate('/login')
        }
      }
    })
  }

  const onError: SubmitErrorHandler<FieldValues> = (errors) => {
    const messages: IObject<IObject<string>> = {
      "email": {
        "required": "Введите email адрес",
        "pattern": "Введите верный email адрес"
      },
      "password": {
        "required": "Введите пароль",
        "minLength": "Пароль должен быть 8 или более символов"
      },
      "name": {
        "required": "Введите важе имя",
        "minLength": "Имя должно содержать не менее 4 символов",
        "maxLength": "Имя должно содержать не более 32 символов"
      }
    }
    let errorMessages: IObject<string> = {}
    for (let error in errors) {
      errorMessages[error] = messages[error]?.[String(errors[error]?.type)] || undefined
    }
    setErrors(errorMessages)
  }

  return <form onSubmit={handleSubmit(onSuccess, onError)} className="login-form">
    <h1>Регистрация</h1>
    <div className="login-form__inputs">
      { mainError && <span className="error">{mainError}</span>}
      <TextInput placeholder="Имя" name="name" register={register} 
        params={{required: true, minLength: 4, maxLength: 32}} error={errors.name} />
      <TextInput placeholder="Email" name="email" register={register} 
        params={{required: true, pattern: emailPattern}} error={errors.email} />
      <PasswordInput placeholder="Пароль" name="password" register={register}
        params={{required: true, minLength: 8}} error={errors.password} />
    </div>
    <Submit label="Регистрация" />
    <span onClick={() => navigate('/login')} 
      className="text-btn" style={{alignSelf: "center"}}
    >
      Войти
    </span>
  </form>
}