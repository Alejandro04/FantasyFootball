export interface ApiTeamResponse {
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

export interface TeamResponse {
  team: Team
  players: Player[]
}

export interface Team {
  id: number
  name: string
  logo: string
}

export interface Player {
  id: number
  name: string
  age: number
  number: any
  position: string
  photo: string
}
