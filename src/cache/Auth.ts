import { makeVar, ReactiveVar } from "@apollo/client";

export type User = {
  id: number,
  name: string,
  description: string,
  email: string,
}

export const currentUser: ReactiveVar<User | null> 
  = makeVar<User | null>(null)