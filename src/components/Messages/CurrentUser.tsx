import { useMutation, useReactiveVar } from "@apollo/client";
import { ControlledMenu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import { FunctionComponent, useMemo, useRef, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { currentUser, User } from "../../cache/Auth";
import { TexteditForm } from "../controls/forms/TexteditForm";
import { UserPicture } from "../UserPicture";
import ModifyUserSchema from "../../api/schemas/mutations/ModifyUser.graphql"

export const CurrentUser: FunctionComponent = () => {
  const user = useReactiveVar(currentUser)
  const [modifyUserMutation] = useMutation(ModifyUserSchema)
  const [isOpen, setOpen] = useState(false)
  const anchorPoint = useRef({ x: 0, y: 0 })
  const [editingField, setEditingField] = useState<"name" | "description">()
  const navigate = useNavigate()

  const name = useMemo(() => {
    return user?.name || ""
  }, [user?.name])

  const colorId = useMemo(() => {
    return name.length + name.charCodeAt(name.length - 1)
  }, [name])

  let description = useMemo(() => {
    if (user?.description) {
      if (user.description.length > 70) {
        return user.description.slice(0, 70) + "..."
      } else {
        return user.description
      }
    }
    return ""
  }, [user?.description])

  const onContextMenu: React.MouseEventHandler<HTMLDivElement> 
    = (e) => {
      e.preventDefault()
      anchorPoint.current = { x: e.clientX, y: e.clientY }
      setOpen(true)
    }

  const closeEditors = () => {
    setEditingField(undefined)
  }

  const modifyUser = (variables: FieldValues) => {
    const optimisticUser = {...user, ...variables} as User
    currentUser(optimisticUser)
    closeEditors()
    modifyUserMutation({
      variables
    }).then(result => {
      if (result && result.data && result.data.modifyUser) {
        const data = result.data.modifyUser
        if (data && data.success && data.user) {
          const newUser = {...user, ...data.user}
          currentUser(newUser)
        }
      }
    }).catch(error => {
      console.log(error)
    })
  }

  const onUserModification: SubmitHandler<FieldValues> = (formData) => {
    const fields = Object.keys(formData)

    for (const field of fields) {
      const value = formData[field]
      const currentValue = (user as FieldValues)[field]

      let variables: FieldValues = {}

      if (value === currentValue || value === "") {
        closeEditors()
        return
      } else {
        variables[field] = value
      }
      
      if (Object.keys(variables).length) {
        modifyUser(variables)
      }
    }
  }

  return <div className="current-user" onContextMenu={onContextMenu}>
    <UserPicture letter={name[0]} colorId={colorId}/>
    <div className="current-user_info">
      { editingField === "name"
        ? <TexteditForm onSubmit={onUserModification} 
            placeholder="Имя пользователя" name="name" 
            close={() => closeEditors()} value={user?.name || ""} 
            params={{required: true, maxLength: 255}}
          />
        : <h3>{name}</h3>
      }
      { editingField === "description"
        ? <TexteditForm onSubmit={onUserModification}
            placeholder="Описание" name="description"
            close={() => closeEditors()} value={user?.description || ""}
          />
        : description 
          ? <span>{description}</span>
          : <span className="no-description">Добавить описание</span>
      }
    </div>
    <ControlledMenu
      anchorPoint={anchorPoint.current}
      state={isOpen ? 'open' : 'closed'}
      direction="right"
      onClose={() => setOpen(false)}
    >
      <MenuItem onClick={(event) => {setEditingField("name")}}>
        <span>Изменить имя</span>
      </MenuItem>
      <MenuItem onClick={(event) => {setEditingField("description")}}>
        <span>Изменить описание</span>
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={(event) => { navigate('/logout') }}>
        <span className="danger">Выйти</span>
      </MenuItem>
    </ControlledMenu>
  </div>
}