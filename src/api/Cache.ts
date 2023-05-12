import { FieldPolicy, InMemoryCache, makeVar, ReactiveVar } from "@apollo/client"


export const selectedChatId: ReactiveVar<number | null>
  = makeVar<number | null>(null)

const toNumber = (fieldName: string) => ({
  [fieldName]: {
    merge: (_, incoming) => Number(incoming)
  } as FieldPolicy
})

export const cache = new InMemoryCache({
  typePolicies: {
    messages: {
      fields: {
        ...toNumber('id'),
        ...toNumber('chat_id')
      }
    },
    user: {
      fields: {
        ...toNumber('id')
      }
    },
    Query: {
      fields: {
        user: {
          merge(existing = {}, incoming) {
            return {...existing, ...incoming[0]}
          }
        },
        chat: {
          read(_, {args, toReference}) {
            return toReference({
              __typename: 'chats',
              id: args?.id
            })
          }
        },
        chats: {
          merge(existing: any[] = [], incoming: any[]) {
            return [...existing, ...incoming.filter(e => !existing.includes(e))]
          }
        }
      }
    }
  }
})