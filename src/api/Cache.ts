import { InMemoryCache, useReactiveVar } from "@apollo/client"
import { currentUser } from "../cache/Auth"
import { messageList } from "../cache/Messages"

export const cache = new InMemoryCache({
  // typePolicies: {
  //   Query: {
  //     fields: {
  //       currentUser: {
  //         read() {
  //           return useReactiveVar(currentUser)
  //         }
  //       },
  //       messageList: {
  //         read() {
  //           return useReactiveVar(messageList)
  //         }
  //       }
  //     }
  //   }
  // }
})