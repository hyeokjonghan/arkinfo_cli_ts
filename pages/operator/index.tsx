import PageLayout from "@/layout/pageLayout";
import ContentLayout from "../../layout/contentLayout";
import style from "@/styles/operator/index.module.scss"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image"
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component'
import rootStore from "@/store/rootStore";
import {observer} from "mobx-react"
import { useGetOperatorList } from "../api/operator";


type opFilterType = {
    printValue: any,
    value: any,
    appendClass: string
}

function OperatorPage() {
    const router = useRouter();
    const searchOpValue = rootStore.searchOp
    const [hasMore, setHasMoer] = useState(false)
    const [filterOn, setFilterOn] = useState(true)
    const [operatorListState, setOperatorStateList] = useState<any[]>([])

    // OperatorList type setting 필요
    const getOperatorListSuccess = (data: any) => {
        if(data.data.last_page === searchOpValue.getSearchOption.page) {
            setHasMoer(false)
        } else {
            setHasMoer(true)
        }
        if(searchOpValue.searchOption.page > 1) {
            setOperatorStateList((current) => {return [...current, ...data.data]})
        } else {
            setOperatorStateList(data.data)
            
        }
        searchOpValue.setLastSearchOption(searchOpValue.getSearchOption)
    }

    const getOperatorListError = (error: any) => {
        console.dir(error)
    }

    const {isLoading, isError, data: operatorList, error} = useGetOperatorList(getOperatorListError, getOperatorListSuccess);

    // 검색 조건 변경시, 첫 페이지 부터 검색 해야 함.
    const setFirstPage = () => {
        searchOpValue.setPage(1)
    }

    const setNextPage = () => {
        if(hasMore) {
            searchOpValue.setPage(searchOpValue.searchOption.page + 1)
        }
    }


    useEffect(() => {
        setFirstPage()
        // if(searchOpValue.getLastSearchOption.name !== searchOpValue.getSearchOption.name) {
        //     setFirstPage()
        // }
        // if(operatorListState.length === 0 || !_.isEqual(searchOpValue.searchOption, searchOpValue.lastSearchOption)) {
        //     setFirstPage()
        // }
    }, [router.query, searchOpValue.searchOption.name,  searchOpValue.getSearchOption.rarity, searchOpValue.getSearchOption.profession])

    // 등급 선택시 Filter 적용
    const setSelectedFilterRarity = (item: opFilterType) => {
        setFirstPage()
        const index = searchOpValue.getSearchOption.rarity.indexOf(item.value)

        if(index !== -1) {
            let tempResult = [...searchOpValue.getSearchOption.rarity]
            tempResult.splice(index,1)
            searchOpValue.setSearchOptionRarity(tempResult)
        } else {
            searchOpValue.setSearchOptionRarity([...searchOpValue.getSearchOption.rarity, item.value])
        }
    }

    // Profession Filter Event
    const setProfessionFilterEvent = (item: opFilterType) => {
        setFirstPage()
        const index = searchOpValue.getSearchOption.profession.indexOf(item.value)
        if (index !== -1) {
            let tempResult = [...searchOpValue.getSearchOption.profession]
            tempResult.splice(index,1)
            searchOpValue.setSearchOptionProfession(tempResult)
        } else {
            searchOpValue.setSearchOptionProfession([...searchOpValue.getSearchOption.profession, item.value])
        }
    }

    // 필터 클리어
    const clearFilter = () => {
        searchOpValue.setSearchOptionRarity([])
        searchOpValue.setSearchOptionProfession([])
        searchOpValue.setSearchOptionName("")
        setOperatorStateList([])
    }

    // 필터
    const printFilterList = [
        {
            name: "등급",
            objName: "rarity",
            appendClass: '',
            clickEvent: (item: opFilterType) => setSelectedFilterRarity(item),
            filterItem: [
                {
                    printValue: 1,
                    value: 0,
                    appendClass: 'rarity0'
                },
                {
                    printValue: 2,
                    value: 1,
                    appendClass: 'rarity1'
                },
                {
                    printValue: 3,
                    value: 2,
                    appendClass: 'rarity2'
                },
                {
                    printValue: 4,
                    value: 3,
                    appendClass: 'rarity3'
                },
                {
                    printValue: 5,
                    value: 4,
                    appendClass: 'rarity4'
                },
                {
                    printValue: 6,
                    value: 5,
                    appendClass: 'rarity5'
                },
            ]
        },
        {
            name: "포지션",
            objName: "profession",
            appendClass: '',
            clickEvent: (item: opFilterType) => setProfessionFilterEvent(item),
            filterItem: [
                {
                    printValue: "뱅가드",
                    value: "PIONEER",
                    appendClass: ''
                },
                {
                    printValue: "가드",
                    value: "WARRIOR",
                    appendClass: ''
                },
                {
                    printValue: "디펜더",
                    value: "TANK",
                    appendClass: ''
                },
                {
                    printValue: "스나이퍼",
                    value: "SNIPER",
                    appendClass: ''
                },
                {
                    printValue: "캐스터",
                    value: "CASTER",
                    appendClass: ''
                },
                {
                    printValue: "메딕",
                    value: "MEDIC",
                    appendClass: ''
                },
                {
                    printValue: "서포터",
                    value: "SUPPORT",
                    appendClass: ''
                },
                {
                    printValue: "스페셜리스트",
                    value: "SPECIAL",
                    appendClass: ''
                },
            ]
        }
    ]


    const setFilterOnEvent = () => {
        setFilterOn((current) => { return !current })
    }

    // 필터 JSX
    const printfilterJsx = printFilterList.map((filterGroup) => {
        return <>
            <div key={filterGroup.name} className={style.filterItemList}>
                <div className={style.filterTitle}>{filterGroup.name}</div>
                <div className={style.filterItem}>
                    {filterGroup.filterItem.map((filter) => {
                        if(filterGroup.objName === "rarity" || filterGroup.objName === "profession") {
                            const checkFilter:Array<string|number> = searchOpValue.getSearchOption[filterGroup.objName]
                            return <>
                            <div key={filter.value} onClick={() => filterGroup.clickEvent(filter)} className={`${style.filter} ${checkFilter.indexOf(filter.value) === -1 ? '' : style.selected}`}>{filter.printValue}</div>
                        </>    
                        }
                        
                    })}
                </div>
            </div>
        </>
    })

    const moveOperatorDetail = (id: string) => {
        router.push(`/operator/${id}`)
    }

    return <>
        <PageLayout>
            <ContentLayout>
            <div className={style.filterWrap}>

                <div className={style.filterHeader}>
                    <span ><i className="bi bi-funnel"></i></span>
                    <span onClick={setFilterOnEvent} className={`${style.filetrOnOff} ${filterOn ? style.filterOpen : ''}`}><i className="bi bi-caret-down-fill"></i></span>
                </div>

                <div className={`${style.filterContentWrap} ${filterOn ? '' : style.filterClose}`}>
                    <div className={`${style.filterList} ${filterOn ? '' : style.filterClose}`}>
                        {printfilterJsx}
                    </div>

                    <div className={style.filterFooter}>
                        <button onClick={() => clearFilter()}>초기화</button>
                        
                    </div>
                </div>
                </div>

                
                    <InfiniteScroll
                    className={style.operatorListWrap}
                    dataLength={operatorListState.length}
                    next={setNextPage}
                    hasMore={hasMore}
                    loader={<></>}>
                    {
                        
                        operatorListState.map((item: any) => {
                            const rarityClass = style["rarity" + item.rarity]
                            return <>
                            <div key={item._id} className={`${style.operatorItem} ${rarityClass}`} onClick={() => {moveOperatorDetail(item._id)}}>
                                <div>
                                    <Image width="180" height="180" src={item.default_avartar_img} alt="Operator Img"></Image>
                                </div>
                                <div className={style.operatorName}>{item.name}</div>
                            </div>
                            </>
                        })
                        
                    }
                    </InfiniteScroll>
                
                

            </ContentLayout>
        </PageLayout>
    </>
}

export default observer(OperatorPage)