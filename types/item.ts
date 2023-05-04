export interface Item {
    _id: string
    itemId: string
    name: string
    description: string
    rarity: number
    iconId: string
    overrideBkg: any
    stackIconId: any
    sortId: number
    usage: string
    obtainApproach: string
    classifyType: string
    itemType: string
    stageDropList: any[]
    buildingProductList: any[]
  }
  
  export type Items = Item[]