export interface ApiCouchResponse {
  get: string
  parameters: Parameters
  errors: any[]
  results: number
  paging: Paging
  response: Response[]
}

export interface Parameters {
  team: string
}

export interface Paging {
  current: number
  total: number
}

export interface CouchResponse {
  id: number
  name: string
  firstname: string
  lastname: string
  age: number
  birth: Birth
  nationality: string
  height?: string
  weight?: string
  photo: string
  team: Team
  career: Career[]
}

export interface Birth {
  date: string
  place?: string
  country: string
}

export interface Team {
  id: number
  name: string
  logo: string
}

export interface Career {
  team: Team2
  start: string
  end?: string
}

export interface Team2 {
  id: number
  name: string
  logo: string
}
