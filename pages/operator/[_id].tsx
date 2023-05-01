import ContentLayout from "@/layout/contentLayout"
import PageLayout from "@/layout/pageLayout"
import { useRouter } from "next/router"
import style from "@/styles/operator/detail.module.scss"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useGetOperatorDetail } from "../api/operator"
import { OperatorDetail, RangeInfo, SkinInfo } from "@/types/opInfo"

export default function OperatorDetail() {
    const router = useRouter()
    const [korFontsize, setKorFontSize] = useState<string>('36px')
    const [korLetterSpacing, setKorLetterSpacing] = useState<string>('-0.5px')
    const [previewImage, setPreviewImage] = useState(``)
    const [chooseElite, setChooseElite] = useState(0)
    const [nowRange, setNowRange] = useState<RangeInfo>()
    const [nowPhases, setNowPhases] = useState({})
    const [printRangeJsx, setPrintRnageJsx] = useState<(number | string)[][]>([])
    const settingRangegrid:(number | string)[][] = []
    const [classImage, setClassImage] = useState(``)

    const rangeGrideInfo = {
        minRow: 0,
        minCol: 0,
        maxRow: 0,
        maxCol: 0,
        rangeInfo: {} as RangeInfo
    }

    // GET Operator Data
    const getOperatorDetailSuccess = (data:OperatorDetail) => {
        if(data) {
            if(data.skinInfo) {
                setPreviewImage(`url('${process.env.NEXT_PUBLIC_CLOUD_URL}characters/${data.skinInfo[0]['portraitId'].replace('#', '%23')}.png')`)
            }

            if(data.phases) {
                setNowPhases(data.phases[0])
            }

            if (data.profession) {
                let tempProfession = data.profession
                switch (tempProfession) {
                    case 'TANK':
                        tempProfession = 'defender'
                        break;
                    case 'MEDIC':
                        tempProfession = 'medic'
                        break;
                    case 'WARRIOR':
                        tempProfession = 'guard'
                        break;
                    case 'SPECIAL':
                        tempProfession = 'specialist'
                        break;
                    case 'PIONEER':
                        tempProfession = 'vanguard'
                        break;
                    case 'SNIPER':
                        tempProfession = 'sniper'
                        break;
                    case 'CASTER':
                        tempProfession = 'caster'
                        break;
                    case 'SUPPORT':
                        tempProfession = 'supporter'
                        break; 
                }
                setClassImage(`url('${process.env.NEXT_PUBLIC_CLOUD_URL}classes/class_${tempProfession}.png')`)
            }

            if (data.name) {
                if (data.name.length > 10) {
                    setKorFontSize('30px')
                    setKorLetterSpacing('-4px')
                }
            }
    
            if (data.rangeInfo) {
                data.rangeInfo.map((range) => {
                    if (range.id === data.phases[0].rangeId) {
                        setNowRange(range)
                        return false
                    }
                })
            }
        }
        
    }

    const getOperatorDetailError = () => {
        // 오류 처리
    }

    const {isLoading, isError, data: operator, error} = useGetOperatorDetail(getOperatorDetailError, getOperatorDetailSuccess, router.query._id as string)

    // SkinChange
    const changeSkinPreview = (skinInfo:any) => {
        setPreviewImage(`url('${process.env.NEXT_PUBLIC_CLOUD_URL}characters/${skinInfo['portraitId'].replace('#', '%23')}.png')`)
    }

    // EliteChange
    const clickEliteEvent = (elite: number) => {
        setChooseElite(elite)
        changeElite(elite)
    }

    const changeElite = (elite:number) => {
        if(operator) {
            switch(elite) {
                case 0:
                    setNowPhases(operator.phases[0])
                break;
                case 1:
                    setNowPhases(operator.phases[1])
                break;
                case 2:
                    setNowPhases(operator.phases[2])
                break;
            }
            changeRangeElite(elite)
        }
    }

    const changeRangeElite = (elite:number) => {
        if(operator) {
            operator.rangeInfo.map((range:RangeInfo) => {
                if (range.id === operator.phases[elite].rangeId) {
                    setNowRange(range)
                    return false
                }
            })
        }
    }

    const transferPosition = (position:string) => {
        switch (position) {
            case 'MELEE':
                return '근거리'
                break;
            case 'RANGED':
                return '원거리'
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        setPrintRnageJsx([])
        if (nowRange !== undefined) {
            rangeGrideInfo.rangeInfo = nowRange
            nowRange.grids.forEach((range) => {
                if (range.col > rangeGrideInfo.maxCol) {
                    rangeGrideInfo.maxCol = range.col
                }
                if (range.col < rangeGrideInfo.minCol) {
                    rangeGrideInfo.minCol = range.col
                }
                if (range.row > rangeGrideInfo.maxRow) {
                    rangeGrideInfo.maxRow = range.row
                }
                if (range.row < rangeGrideInfo.minRow) {
                    rangeGrideInfo.minRow = range.row
                }
            })


            for (let row = rangeGrideInfo.minRow; row <= rangeGrideInfo.maxRow; row++) {
                settingRangegrid[row] = []
                for (let col = rangeGrideInfo.minCol; col <= rangeGrideInfo.maxCol; col++) {
                    if (row === 0 && col === 0) {
                        settingRangegrid[row][col] = 'o'
                    } else {
                        settingRangegrid[row][col] = 0
                    }
                }
            }

            rangeGrideInfo.rangeInfo.grids.map((item) => {
                if (settingRangegrid[item.row][item.col] !== 'o') {
                    settingRangegrid[item.row][item.col] = 1
                }
            })


            for (let row = rangeGrideInfo.minRow; row <= rangeGrideInfo.maxRow; row++) {
                setPrintRnageJsx((current) => {
                    return [...current, settingRangegrid[row]]
                })

            }
        }

    }, [nowRange])
    
    return <>
        <PageLayout>
            <ContentLayout>
            <div className={style.operatorDetailWrap}>
                    {/* 스킨 */}
                    <div className={style.skinDefaultInfoWrap}>
                        <div className={style.operatorSkinWrap}>
                            
                            <div className={style.operatorSkinPreviewWrap}>
                                {
                                    operator &&
                                        <div className={style.operatorSkin} id="skinPreview" style={{ backgroundImage: previewImage }}></div>
                                }


                            </div>

                            <div className={style.operatorSkinList}>
                                <ul>
                                    {
                                        operator && operator.skinInfo.map((item: SkinInfo) => {
                                            return <>
                                                <li className={style.operatorSkinItem} key={item._id} style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_CLOUD_URL}avatars/${item['avatarId'].replace('#', '%23')}.png')` }} onClick={() => changeSkinPreview(item)}></li>
                                            </>
                                        })
                                    }

                                </ul>
                            </div>

                        </div>

                        <div className={style.defaultInfoWrap}>

                            <div className={style.rankWrap}>
                                {
                                    operator && Array(operator.rarity + 1).fill(0).map((e, i) => {
                                        return <>
                                            <div className={style.starwrap} key={i}>
                                                <i className="bi bi-star-fill"></i>
                                            </div>
                                        </>
                                    })
                                }


                            </div>
                            {
                                operator && <>
                                <div className={style.nameWrap}>
                                    <div className={style.appellation}>{operator.appellation}</div>
                                    <div className={style.name} style={{ letterSpacing: korLetterSpacing, fontSize: korFontsize }}>{operator.name}</div>
                                </div>
                                </>
                            }

                            {
                                operator && <>
                                <div className={style.choosePhasesWrap}>
                                    <ul>
                                        {operator.phases.length >= 1 ? <li className={chooseElite===0?style.active:''}><Image src="/sample/elite/0-s.png" width={40} height={40} alt="elite-0" onClick={() => clickEliteEvent(0)}></Image></li>:<></>}
                                        {operator.phases.length >= 2 ? <li className={chooseElite===1?style.active:''}><Image src="/sample/elite/1-s.png" width={40} height={40} alt="elite-1" onClick={() => clickEliteEvent(1)}></Image></li>:<></>}
                                        {operator.phases.length >= 3 ? <li className={chooseElite===2?style.active:''}><Image src="/sample/elite/2-s.png" width={40} height={40} alt="elite-2" onClick={() => clickEliteEvent(2)}></Image></li>:<></>}
                                    </ul>
                                </div>   
                                </>
                            }

                            <div className={style.defaultInfo}>

                                <div className={style.prefession} style={{ backgroundImage: `${classImage}` }}></div>

                                <div className={style.rangeWrap}>
                                    <div className={style.range}>

                                        <table className={style.rangeTable}>
                                            <tbody>
                                                {printRangeJsx.map((row) => {
                                                    return <>
                                                        <tr>
                                                            {
                                                                row.map((col) => {
                                                                    if (col === 1) {
                                                                        return <><td className={style.rangeTarget}></td></>
                                                                    } else if (col === 'o') {
                                                                        return <><td className={style.rangeOrigin}></td></>
                                                                    } else {
                                                                        return <><td></td></>
                                                                    }
                                                                })
                                                            }
                                                        </tr>
                                                    </>

                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>공격범위</div>
                                </div>
                                <div className={style.positionTagWrap}>
                                    <div className={style.positionWrap}>
                                        {
                                            operator ? transferPosition(operator.position) : ''
                                        }
                                    </div>
                                    <div className={style.tagWrap}>
                                        {operator ? <>
                                            {
                                                operator.tagList.map((tag: string, index:number) => {
                                                    return <>
                                                        <span key={index}>{tag}</span>
                                                    </>
                                                })
                                            }
                                        </> : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </ContentLayout>
        </PageLayout>
    </>
}