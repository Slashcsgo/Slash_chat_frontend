import { makeVar, ReactiveVar } from "@apollo/client";
import { User } from "./Auth";

export const users: ReactiveVar<User[]>
  = makeVar<User[]>([])