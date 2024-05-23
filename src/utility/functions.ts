import {ServiceDescriptor} from "../types/Types";

export type ActionName = {
  name    :string;
  hostName: string;
  port    : string;
}

export const parseActionName = (a:string): ActionName => {

  return { name:"", hostName: "", port:"" }

}
