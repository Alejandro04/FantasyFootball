export interface ApiCoachResponse {
  response: Coach[]
}

export interface Coach {
  id: number,
  name: string,
  age: number,
  nationality: string,
  photo: string
}