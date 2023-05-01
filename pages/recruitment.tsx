import ContentLayout from "../layout/contentLayout";
import PageLayout from "../layout/pageLayout";
import style from "@/styles/recruitment/recruitment.module.scss"
import OperatorCard from "../components/card/operator";
import { useCallback, useEffect, useState } from "react";
import OperatorLabel from "@/components/label/operator";
import { isSubSet, interSectSets, getCombinations } from "@/lib/HjMath";
import axios from "axios";
import {TagInfo} from "../types/tagInfo"
import {OpInfo} from "../types/opInfo"

type serverSideResult = {
    tagList:TagInfo[],
    opList:OpInfo[]
}

type printTagListType = {
    [key:string]: TagInfo[];
}

type matchOpInfoType = {
    tagInfo:number[],
    tagInfoSet:Set<number>,
    opList:OpInfo[],
    minRarity:number,
}

type matchOpListType = {
    [key:string]: matchOpInfoType;
}

type tagIndexListType = {
    [key:number]: TagInfo
}

export default function RecruimentPage(props: {results: serverSideResult}) {
    const tagList = props.results.tagList
    const opList = props.results.opList
    const printTagList: printTagListType = {};
    const tagIndexList: tagIndexListType = {}

    

    tagList.map((item) => {
        tagIndexList[item.tag_code] = item
    })

    tagList.map((item) => {
        if(!printTagList[item.type]) {
            printTagList[item.type] = []
        }
        printTagList[item.type] = [...printTagList[item.type], item]
    })

    const [selectTag, setSelectTag] = useState<number[]>([])
    const [selectOp, setSelectOp] = useState<matchOpInfoType[]>([])
    const [printImg, setPrintImg] = useState(true)
    const [printHightOp, setPrintHeightOp] = useState(false)

    const setSelectTagEvent = (tagNo: number) => {
        setSelectTag((current) => {
            if (selectTag.includes(tagNo)) {
                let returnTagList = current.filter((e) => { return e !== tagNo });
                return returnTagList;
            } else {
                if (current.length < 5) {
                    return [...current, tagNo];
                } else {
                    return current;
                }
            }
        })

        console.dir(selectTag)
    }
    const setSelectTagClear = () => {
        setSelectTag(() => {
            return []
        })
    }
    const setPrintImgEvent = () => {
        setPrintImg(current => !current)
    }
    const setPrintHeightOpEvent = () => {
        setPrintHeightOp(current => !current)
    }

    const setOpListEvent = useCallback(() => {
        let matchOpList: matchOpListType = {}
        if(selectTag.length > 0) {
            let selectTagSet = new Set(selectTag)
            getCombinations(selectTag).map((matchOpIndex) => {
                let matchOpIndexToString:string = matchOpIndex.join(',')
                matchOpList[matchOpIndexToString] = {
                    tagInfo:matchOpIndex,
                    tagInfoSet:new Set(matchOpIndex),
                    opList:[],
                    minRarity:0
                }
            })
            

            opList.map((item) => {
                let opTaglist = new Set(item.recruitmentTagCodeList)
                if(interSectSets(selectTagSet, opTaglist).length > 0) {
                    Object.keys(matchOpList).map((matchTag) => {
                        if(isSubSet(opTaglist, matchOpList[matchTag].tagInfoSet)) {
                            if((matchOpList[matchTag].tagInfoSet.has(30) && item.rarity === 5) || (!matchOpList[matchTag].tagInfoSet.has(30)) && item.rarity < 5)
                                matchOpList[matchTag].opList = [...matchOpList[matchTag].opList, item]
                            
                            

                            if(!matchOpList[matchTag].minRarity) {
                                if(item.rarity !== 0) {
                                    matchOpList[matchTag].minRarity = item.rarity
                                }
                            } else {
                                if(matchOpList[matchTag].minRarity > item.rarity) {
                                    matchOpList[matchTag].minRarity = item.rarity
                                }
                            }
                            
                        }
                    })
                }
                

            })
    
            // Object 정렬
            let objectIndexRemoved:matchOpInfoType[] = []
            Object.keys(matchOpList).map((index) => {
                // 없는거 삭제
                if(matchOpList[index].opList.length > 0) {
                    objectIndexRemoved.push(matchOpList[index])
                }
                
            })
            
            let sortedOpList = objectIndexRemoved.sort(function (a: matchOpInfoType, b: matchOpInfoType) {
                return b.minRarity - a.minRarity
            })
    
            sortedOpList.sort(function (a: matchOpInfoType,b: matchOpInfoType) {
                if(a.minRarity === b.minRarity) {
                    return b.tagInfo.length - a.tagInfo.length
                } else {
                    return b.minRarity - a.minRarity
                }
            })
    
    
            sortedOpList.map((item) => {
                item.opList.sort(function(a:OpInfo, b:OpInfo) {
                    return b.rarity - a.rarity
                })
            })
            
            setSelectOp(sortedOpList)
        } else {
            setSelectOp([])
        }
    }, [selectTag])

    // 모든 경우의 수 반환..


    useEffect(() => {
        setOpListEvent()
    }, [selectTag])

    const printTagListJsx = Object.keys(printTagList).map((opClass) => {
        if(opClass !=="sex") {
            return <>
            <div className={style.tagPickerListWrap}>
                <div className={style.tagPickerList}>
                    {printTagList[opClass].map((item) => {
                        return <>
                            <div key={item.tag_code} className={`${style.tag} ${selectTag.includes(item.tag_code)? style.selected:''}`} onClick={
                                (e) => {const tagNo = Number(item.tag_code);
                                    setSelectTagEvent(tagNo)
                                }}>
                                    {selectTag.includes(item.tag_code)}{item.name.kr}
                                </div>
                        </>
                    })}
                </div>
            </div>
        </>
        }
    })

    const printMatchOpJsx = selectOp.map((item, index) => {
        if(!printHightOp || (printHightOp && item.minRarity >=3)) {
            return <>
            <div className={style.resultWrap} key={index}>
                <div className={style.resultInnerWrap}>
                    <div className={style.pickerTagWrap}>
                        {item.tagInfo.map((tag) => {
                            let matchTagInfo = tagIndexList[tag]
                            return <>
                                <div key={matchTagInfo.tag_code} className={style.pickterTag}>{matchTagInfo.name.kr}</div>
                            </>
                        })}
                        

                    </div>
                    <div className={style.resultOpWrap}>
                        {item.opList.map((op => {
                                if(printImg) {
                                    return <>
                                        <OperatorCard key={op._id} opInfo={op}></OperatorCard>
                                    </>
                                } else {
                                    return <>
                                        <OperatorLabel key={op._id} opInfo={op}></OperatorLabel>
                                    </>
                                }
                            
                        }))}
                    </div>
                </div>
            </div>
        </>
        }
        
    })

    return <>
        <PageLayout>
            <ContentLayout>
                <div>
                    <div className={style.tagPicker}>

                        {printTagListJsx}

                        <div className={style.btnListWrap}>
                            <button onClick={setSelectTagClear}>초기화</button>
                            <button onClick={setPrintImgEvent} className={printImg? style.active: ``}>이미지노출</button>
                            <button onClick={setPrintHeightOpEvent} className={printHightOp? style.active: ``}>4성 이상 확정</button>
                        </div>
                        
                    </div>

                    {printMatchOpJsx}

                </div>

            </ContentLayout>
        </PageLayout>
    </>
}

export async function getServerSideProps() {
    // 두가지 데이터는 가변적이지 않고 정적이기 때문에, 한번만 호출하면 된다.
    // getServerSideProps쪽에서 호출함으로서, 페이지 전환시에도 데이터가 유지되게끔 처리
    const tagList = await(await axios.get(`https://api.arkinfo.kr/api/recruitment/tag/list`)).data
    const opList = await(await axios.get(`https://api.arkinfo.kr/api/recruitment/op/list`)).data

    return {
        props: {
            results:{
                tagList:tagList,
                opList:opList
            }
        }
    }
}