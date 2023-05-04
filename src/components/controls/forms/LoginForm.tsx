import { useMutation } from "@apollo/client";
import { FunctionComponent, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { emailPattern } from "../../../helpers/ValidationPatterns";
import { Submit } from "../buttons/Submit";
import { PasswordInput } from "../inputs/PasswordInput";
import { TextInput } from "../inputs/TextInput";
import LoginSchema from "../../../api/schemas/Login.graphql"
import { setToken } from "../../../helpers/AuthHelper";
import { useNavigate } from "react-router-dom";
import { hash } from "../../../helpers/Hash";

type Errors = {
  email?: string,
  password?: string
}

interface IObject<T> {
  [index: string]: T | undefined
}

export const LoginForm: FunctionComponent = () => {
  const { register, handleSubmit} = useForm()
  const [errors, setErrors] = useState<Errors>({})
  const [mainError, setMainError] = useState<String>()

  const [login] = useMutation(LoginSchema)
  const navigate = useNavigate()

  const onSuccess: SubmitHandler<FieldValues> = async (formData) => {
    const password = await hash(formData.password)
    setErrors({})
    login({
      variables: {
        email: formData.email,
        password: password
      }
    }).then(result => {
      if (result && result.data && result.data.login) {
        const payload = result.data.login
        if (payload.error && payload.error.code) {
          if (payload.error.code === 403) {
            setMainError("Вы ввели неверный email или пароль")
          } else {
            setMainError("Неопознанная ошибка, попробуйте позже")
          }
        } else if (payload.success && payload.token) {
          setToken(payload.token)
          navigate('/')
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
      }
    }
    let errorMessages: IObject<string> = {}
    for (let error in errors) {
      errorMessages[error] = messages[error]?.[String(errors[error]?.type)] || undefined
    }
    setErrors(errorMessages)
  }
  
  return <form onSubmit={handleSubmit(onSuccess, onError)} className="login-form">
    <h1>Вход в приложение</h1>
    <div className="login-form__inputs">
      { mainError && <span className="error">{mainError}</span> }
      <TextInput placeholder="Email" name="email" register={register} 
        params={{required: true, pattern: emailPattern}} error={errors.email} />
      <PasswordInput placeholder="Пароль" name="password" register={register}
        params={{required: true, minLength: 8}} error={errors.password} />
    </div>
    <Submit label="Войти" />
    <span onClick={() => navigate('/register')} 
      className="text-btn" style={{alignSelf: "center"}}
    >
      Регистрация
    </span>
  </form>

}