export declare type UserData = {
  name: string
  age?: number
  gender: number
}

export declare type UserInfo = UserData & {
  uid: number
}
export declare type Roles=["admin","guest"]
export declare type Places={
  uid:number,
  name:string,
  geo_coor:string,

}