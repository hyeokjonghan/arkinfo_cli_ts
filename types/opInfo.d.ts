import {Item} from "@/types/item"
export interface OpInfo {
    default_card_img: string,
    isRecruitment: boolean,
    name: string,
    rarity: number,
    recruitmentTagCodeList:[number],
    _id: string
}

export interface OperatorDetail {
    _id: string
    name: string
    description: string
    canUseGeneralPotentialItem: boolean
    potentialItemId: string
    nationId: string
    groupId: any
    teamId: any
    displayNumber: string
    tokenKey: any
    appellation: string
    position: string
    tagList: string[]
    itemUsage: string
    itemDesc: string
    itemObtainApproach: string
    isNotObtainable: boolean
    isSpChar: boolean
    maxPotentialLevel: number
    rarity: number
    profession: string
    subProfessionId: string
    trait: any
    phases: Phase[]
    skills: Skill[]
    talents: Talent[]
    potentialRanks: PotentialRank[]
    favorKeyFrames: FavorKeyFrame[]
    allSkillLvlup: AllSkillLvlup[]
    isRecruitment: boolean
    updated_at: string
    default_card_img: string
    default_avartar_img: string
    rangeInfo: RangeInfo[]
    skinInfo: SkinInfo[]
  }
  
  export interface Phase {
    characterPrefabKey: string
    rangeId: string
    maxLevel: number
    attributesKeyFrames: AttributesKeyFrame[]
    evolveCost?: EvolveCost[]
  }
  
  export interface AttributesKeyFrame {
    level: number
    data: Data
  }
  
  export interface Data {
    maxHp: number
    atk: number
    def: number
    magicResistance: number
    cost: number
    blockCnt: number
    moveSpeed: number
    attackSpeed: number
    baseAttackTime: number
    respawnTime: number
    hpRecoveryPerSec: number
    spRecoveryPerSec: number
    maxDeployCount: number
    maxDeckStackCnt: number
    tauntLevel: number
    massLevel: number
    baseForceLevel: number
    stunImmune: boolean
    silenceImmune: boolean
    sleepImmune: boolean
    frozenImmune: boolean
    levitateImmune: boolean
  }
  
  export interface EvolveCost {
    id: string
    count: number
    type: string
    item?: Item
  }
  
  export interface Skill {
    skillId: string
    overridePrefabKey: any
    overrideTokenKey: any
    levelUpCostCond: LevelUpCostCond[]
    unlockCond: UnlockCond2
  }
  
  export interface LevelUpCostCond {
    unlockCond: UnlockCond
    lvlUpTime: number
    levelUpCost: LevelUpCost[]
  }
  
  export interface UnlockCond {
    phase: number
    level: number
  }
  
  export interface LevelUpCost {
    id: string
    count: number
    type: string
  }
  
  export interface UnlockCond2 {
    phase: number
    level: number
  }
  
  export interface Talent {
    candidates: Candidate[]
  }
  
  export interface Candidate {
    unlockCondition: UnlockCondition
    requiredPotentialRank: number
    prefabKey: string
    name: string
    description: string
    rangeId: any
    blackboard: Blackboard[]
  }
  
  export interface UnlockCondition {
    phase: number
    level: number
  }
  
  export interface Blackboard {
    key: string
    value: number
  }
  
  export interface PotentialRank {
    type: number
    description: string
    buff?: Buff
    equivalentCost: any
  }
  
  export interface Buff {
    attributes: Attributes
  }
  
  export interface Attributes {
    abnormalFlags: any
    abnormalImmunes: any
    abnormalAntis: any
    abnormalCombos: any
    abnormalComboImmunes: any
    attributeModifiers: AttributeModifier[]
  }
  
  export interface AttributeModifier {
    attributeType: number
    formulaItem: number
    value: number
    loadFromBlackboard: boolean
    fetchBaseValueFromSourceEntity: boolean
  }
  
  export interface FavorKeyFrame {
    level: number
    data: Data2
  }
  
  export interface Data2 {
    maxHp: number
    atk: number
    def: number
    magicResistance: number
    cost: number
    blockCnt: number
    moveSpeed: number
    attackSpeed: number
    baseAttackTime: number
    respawnTime: number
    hpRecoveryPerSec: number
    spRecoveryPerSec: number
    maxDeployCount: number
    maxDeckStackCnt: number
    tauntLevel: number
    massLevel: number
    baseForceLevel: number
    stunImmune: boolean
    silenceImmune: boolean
    sleepImmune: boolean
    frozenImmune: boolean
    levitateImmune: boolean
  }
  
  export interface AllSkillLvlup {
    unlockCond: UnlockCond3
    lvlUpCost: LvlUpCost[]
  }
  
  export interface UnlockCond3 {
    phase: number
    level: number
  }
  
  export interface LvlUpCost {
    id: string
    count: number
    type: string
  }
  
  export interface RangeInfo {
    _id: string
    id: string
    direction: number
    grids: Grid[]
  }
  
  export interface Grid {
    row: number
    col: number
  }
  
  export interface SkinInfo {
    _id: string
    skinId: string
    charId: string
    tokenSkinMap: any
    illustId: string
    dynIllustId: any
    avatarId: string
    portraitId: string
    dynPortraitId: any
    dynEntranceId: any
    buildingId?: string
    battleSkin: BattleSkin
    isBuySkin: boolean
    tmplId: any
    voiceId: any
    voiceType: string
    displaySkin: DisplaySkin
  }
  
  export interface BattleSkin {
    overwritePrefab: boolean
    skinOrPrefabId?: string
  }
  
  export interface DisplaySkin {
    skinName?: string
    colorList: string[]
    titleList: string[]
    modelName: string
    drawerName: string
    skinGroupId: string
    skinGroupName: string
    skinGroupSortIndex: number
    content: string
    dialog?: string
    usage?: string
    description?: string
    obtainApproach?: string
    sortId: number
    displayTagId: any
    getTime: number
    onYear: number
    onPeriod: number
  }
  
  export interface PrintTalentBtn {
    phase: number[],
    potentialRank: number[]
  }