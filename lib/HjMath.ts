export const isSubSet = <T>(superSet: Set<T>, setA: Set<T>) => {
    let result = true
    setA.forEach(e => {
        if(!superSet.has(e)) result = false
    })
    return result
}

export const interSectSets = <T>(setA: Set<T>, setB: Set<T>) => {
    let intersection: T[] = []
    setB.forEach(e=> {
        if(setA.has(e)) intersection.push(e)
    })

    return intersection
}

export const getCombinations = <T>(targetArr: T[]) => {
    let result: T[][] = []
    let f = (tempArr: T[], targetArr: T[]) => {
        for(let i = 0; i < targetArr.length; i++) {
            result = [...result, [...tempArr, targetArr[i]]]
            f([...tempArr, targetArr[i]], targetArr.slice(i+1))
        }
    }
    f([],targetArr)
    return result
}
