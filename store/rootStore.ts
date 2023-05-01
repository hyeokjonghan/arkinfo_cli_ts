import SearchOp from "./searchOp";
class RootStore {
    searchOp: SearchOp;
    constructor() {
        this.searchOp = new SearchOp()
    }
}

const rootStore = new RootStore()

export default rootStore