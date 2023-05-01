import { action, computed, makeAutoObservable, observable } from "mobx";
export interface SearchOptionType {
    page:number,
    rarity:number[],
    name:string,
    profession:string[]
}

export default class SearchOp {
    searchOption:SearchOptionType = {
        page:1,
        rarity:[],
        name:'',
        profession:[]
    }
    
    lastSearchOption:SearchOptionType = {
        page:1,
        rarity:[],
        name:'',
        profession:[] 
    }

    constructor() {
        makeAutoObservable(this, {
            searchOption: observable,
            lastSearchOption: observable,
            setPage:action,
            setSearchOptionProfession: action,
            setSearchOptionName: action,
            setSearchOptionRarity: action,
            setLastSearchOption: action,
            getSearchOption: computed,
            getLastSearchOption: computed
        })
    }

    setPage = (page:number) => {
        this.searchOption.page = page
    }

    setSearchOptionProfession = (profession: string[]) => {
        this.searchOption.profession = profession
    }

    setSearchOptionName = (name: string) => {
        this.searchOption.name = name
    }

    setSearchOptionRarity = (rarity: number[]) => {
        this.searchOption.rarity = rarity
    }

    setClearSaerchOption = () => {
        this.searchOption = {
            page:1,
            rarity:[],
            name:'',
            profession:[]
        }
    }

    setLastSearchOption = (lastSearchOption: SearchOptionType) => {
        this.lastSearchOption = lastSearchOption
    }

    get getSearchOption() {
        return this.searchOption
    }

    get getLastSearchOption() {
        return this.lastSearchOption
    }

    

    
}