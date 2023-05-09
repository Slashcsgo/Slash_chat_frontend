import { useMutation, useReactiveVar } from "@apollo/client";
import { ControlledMenu, MenuDivider, MenuItem, SubMenu } from "@szhsin/react-menu";
import { FunctionComponent, useMemo, useRef, useState } from "react";
import { currentUser } from "../../../cache/Auth";
import { ImageButton } from "../../controls/buttons/ImageButton";
import { UserPicture } from "../../UserPicture";
import ElipsisImage from "../../../static/images/ellipsis.svg";
import ModifyChatSchema from "../../../api/schemas/mutations/ModifyChat.graphql"
import RemoveChatSchema from "../../../api/schemas/mutations/RemoveChat.graphql"
import QuitChatSchema from "../../../api/schemas/mutations/QuitChat.graphql"
import AddUserToChatSchema from "../../../api/schemas/mutations/AddUserToChat.graphql"
import RemoveUserFromChatSchema from "../../../api/schemas/mutations/RemoveUserFromChat.graphql"
import { TexteditForm } from "../../controls/forms/TexteditForm";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Chat, chats, chatsPreviews, selectedChatId } from "../../../cache/Messages";
import { users } from "../../../cache/Users";

type Props = {
  chat: Chat
}

export const ChatHeader: FunctionComponent<Props> = ({chat}) => {
  const {title, description, id, admin_id: adminId} = chat
  const user = useReactiveVar(currentUser)
  const MenuButtonRef = useRef(null)
  const [isOpen, setOpen] = useState(false)
  const [modifyChatMutation] = useMutation(ModifyChatSchema)
  const [removeChatMutation] = useMutation(RemoveChatSchema)
  const [quitChatMutation] = useMutation(QuitChatSchema)
  const [AddUserToChatMutation] = useMutation(AddUserToChatSchema)
  const [RemoveUserFromChatMutation] = useMutation(RemoveUserFromChatSchema) 
  
  const chatsData = useReactiveVar(chats)
  const chatsPreviewsData = useReactiveVar(chatsPreviews)
  const usersDataRaw = useReactiveVar(users)
  
  const chatUsers = useMemo(() => {
    return chat.users.filter(e => e.id !== user?.id)
  }, [chat.users, user])
  const usersData = useMemo(() => {
    return usersDataRaw.filter(e => {
      return e.id !== user?.id && !chatUsers.find(el => el.id === e.id)
    })
  }, [usersDataRaw, user, chatUsers])

  const [editingField, setEditingField] = useState<"title" | "description">()

  const closeEditors = () => {
    setEditingField(undefined)
  }

  const updateChat = (variables: FieldValues) => {
    const optimisticChat = {...chat, ...variables} as Chat
    const newChats = {...chatsData, [chat.id]: optimisticChat}

    const newChatsPreviews = Array.from(chatsPreviewsData || [])
    const chatPreviewIndex = newChatsPreviews.findIndex(e => e.id === id)

    newChatsPreviews[chatPreviewIndex] = {
      id: optimisticChat.id,
      description: optimisticChat.description,
      title: optimisticChat.title
    }

    chats(newChats)
    chatsPreviews(newChatsPreviews)
  }

  const removeChat = (chatId: number) => {
    const newChatsPreviews = Array.from(chatsPreviewsData || []).filter(e => e.id !== chatId)
    chatsPreviews(newChatsPreviews)

    const newChats = {...chatsData}
    delete newChats[chatId]
    chats(newChats)
    selectedChatId(null)
  }

  const modifyChat = (variables: FieldValues) => {
    updateChat(variables)

    closeEditors()

    modifyChatMutation({
      variables: {
        ...variables,
        id: chat.id
      }
    }).then((e) => {
      console.log(e)
    }).catch(error => {
      console.log(error)
    })
  }

  const deleteChat = () => {
    removeChatMutation({
      variables: {
        id: chat.id
      }
    }).then((result) => {
      if (result && result.data && result.data.removeChat) {
        removeChat(id)
      }
    })
  }

  const quitChat = () => {
    quitChatMutation({
      variables: {
        chatId: id
      }
    }).then((result) => {
      if (result && result.data && result.data.quitChat) {
        removeChat(id)
      }
    })
  }

  const addUserToChat = (id: number, name: string) => {
    AddUserToChatMutation({
      variables: {
        userId: id,
        chatId: chat.id
      }
    })
  }

  const removeUserFromChat = (id: number, name: string) => {
    RemoveUserFromChatMutation({
      variables: {
        userId: id,
        chatId: chat.id
      }
    })
  }

  const onChatModification: SubmitHandler<FieldValues> = (formData) => {
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
        modifyChat(variables)
      }
    }
  }

  return <div className="chat-header">
    <UserPicture letter={title[0]} colorId={title.length + title.charCodeAt(title.length - 1)} />
    <div className="chat-header_info">
      {editingField === 'title' 
        ? <TexteditForm onSubmit={onChatModification} 
            placeholder="Имя пользователя" name="title" 
            close={() => closeEditors()} value={title || ""} 
            params={{required: true, maxLength: 255}}
          />
        : <h3>{title}</h3>
      }
      { editingField === "description"
        ? <TexteditForm onSubmit={onChatModification}
            placeholder="Описание" name="description"
            close={() => closeEditors()} value={description || ""}
          />
        : description 
          ? <span>{description}</span>
          : <span>Нет описания</span>
      }
    </div>
    <div style={{alignSelf: "center"}} ref={MenuButtonRef}>
      <ImageButton image={ElipsisImage} alt="Меню чата" onClick={() => setOpen(true)} />
    </div>
    
    <ControlledMenu 
      anchorRef={MenuButtonRef}
      state={isOpen ? 'open' : 'closed'}
      onClose={() => setOpen(false)}
      boundingBoxPadding="80 10"
      position="anchor"
    >
      {user?.id === adminId &&
        <>
          <MenuItem onClick={() => setEditingField("title")}>
            <span>Изменить название</span>
          </MenuItem>
          <MenuItem onClick={() => setEditingField("description")}>
            <span>Изменить описание</span>
          </MenuItem>
          { !!usersData.length &&
            <SubMenu offsetX={8} overflow="auto" label={<span>Добавить пользователя</span>}>
              { usersData.map((item) => {
                return (
                  <MenuItem key={item.id} onClick={() => addUserToChat(item.id, item.name)}>
                    <span>{item.name}</span>
                  </MenuItem>
                )
              })}
            </SubMenu>
          }
          <MenuDivider />
          <MenuItem onClick={() => deleteChat()}>
            <span className="danger">Удалить чат</span>
          </MenuItem>
          { !!chatUsers.length &&
            <SubMenu offsetX={8} overflow="auto" label={
              <span className="danger">Удалить пользователя</span>
            }>
              { chatUsers.map((item) => {
                return (
                  <MenuItem key={item.id} onClick={() => removeUserFromChat(item.id, item.name)}>
                    <span>{item.name}</span>
                  </MenuItem>
                )
              })}
            </SubMenu>
          }
          <MenuDivider />
        </>
      }
      <MenuItem onClick={() => quitChat()}>
        <span className="danger">Выйти из чата</span>
      </MenuItem>
    </ControlledMenu>
  </div>
}