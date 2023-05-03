export interface InfraType {
    _id: string
    chars: Chars
    infra: Infras
  }
  
  export interface Chars {
    [key:string]: Char
  }
  
  export interface Char {
    charId: string
    maxManpower: number
    buffChar: BuffChar[]
  }
  
  export interface BuffChar {
    buffData: BuffDaum[]
  }
  
  export interface BuffDaum {
    buffId: string
    cond: Cond,
    infra?:Infra
  }
  
  export interface Cond {
    phase: number
    level: number
  }

  export interface Infras {
    [key:string]: Infra
  }
  
  export interface Infra {
    buffId: string
    buffName: string
    buffIcon: string
    skillIcon: string
    sortId: number
    buffColor: string
    textColor: string
    buffCategory: string
    roomType: string
    description: string
  }

  export interface PrintInfra {
    phase: number,
  }
