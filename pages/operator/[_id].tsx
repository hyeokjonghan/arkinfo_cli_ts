import RangeSlider from 'react-bootstrap-range-slider';
import ContentLayout from "@/layout/contentLayout"
import PageLayout from "@/layout/pageLayout"
import { useRouter } from "next/router"
import style from "@/styles/operator/detail.module.scss"
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { useGetOperatorDetail, getOperatorDetail } from "../api/operator"
import { OperatorDetail, RangeInfo, SkinInfo, PrintTalentBtn, Candidate } from "@/types/opInfo"
import { BuffDaum, Infra, InfraType, PrintInfra } from "@/types/infra"
import StackGrid, { Grid } from "react-stack-grid"
import { GetServerSidePropsContext } from 'next';
import { getInfraInfo } from '../api/infra';
import { getItemInfo } from '../api/item';
import { Items } from '@/types/item';

import { replaceInfraDescription, replaceTalentDescription } from "@/lib/replaceText"

type ssrType = {
    operator: OperatorDetail,
    infra: InfraType,
    itemInfo: any
}

type ssrResultType = {
    results: ssrType
}

export default function OperatorDetailPage({ results }: ssrResultType) {

    const router = useRouter()
    const [korFontsize, setKorFontSize] = useState<string>('36px')
    const [korLetterSpacing, setKorLetterSpacing] = useState<string>('-0.5px')
    const [previewImage, setPreviewImage] = useState(``)
    const [chooseElite, setChooseElite] = useState(0)
    const [nowRange, setNowRange] = useState<RangeInfo>()
    const [nowPhases, setNowPhases] = useState({})
    const [printRangeJsx, setPrintRnageJsx] = useState<(number | string)[][]>([])
    const settingRangegrid: (number | string)[][] = []
    const [classImage, setClassImage] = useState(``)
    const [level, setLevel] = useState(1)
    const [clientWidth, setClientWidth] = useState(0)
    const detailWrapRef = useRef<HTMLInputElement>(null);
    const [operator, setOperator] = useState(results.operator)
    const [trustInfo, setTrustInfo] = useState(results.operator.favorKeyFrames.find(obj => obj.level === 50)?.data)

    const [printInfra, setPrintInfra] = useState<PrintInfra[]>([])
    const [chooseInfraElite, setChooseInfraElite] = useState(0)
    const searchId = operator.potentialItemId.slice(2)

    const [printFirstInfra, setPrintFirstInfra] = useState<Infra | null>(null)
    const [printSecondInfra, setPrintSecondInfra] = useState<Infra | null>(null)

    const [stackGrid, setStackGrid] = useState<Grid | null>(null)

    const [chooseTalentElite, setChooseTalentElite] = useState(0)
    const [chooseTalentPotential, setChooseTalentPotential] = useState(0)
    const [printTalentBtn, setPrintTalentBtn] = useState<PrintTalentBtn>({ phase: [], potentialRank: [] })
    const [printTalent, setPrintTalent] = useState<Candidate[]>([])




    // 초기 데이터 세팅
    useEffect(() => {
        if (operator.skinInfo) {
            setPreviewImage(`url('${process.env.NEXT_PUBLIC_CLOUD_URL}characters/${operator.skinInfo[0]['portraitId'].replace('#', '%23')}.png')`)
        }

        if (operator.phases) {
            setNowPhases(operator.phases[0])
        }

        if (operator.profession) {
            let tempProfession = operator.profession
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

        if (operator.name) {
            if (operator.name.length > 10) {
                setKorFontSize('30px')
                setKorLetterSpacing('-4px')
            }
        }

        if (operator.rangeInfo) {
            operator.rangeInfo.map((range) => {
                if (range.id === operator.phases[0].rangeId) {
                    setNowRange(range)
                    return false
                }
            })
        }

        if (results.infra) {
            let tempCond: PrintInfra[] = []

            results.infra.chars[searchId].buffChar.map(item => {
                item.buffData.map(buff => {
                    buff.infra = results.infra.infra[buff.buffId]
                    let checkCond = tempCond.find(object => object.phase === buff.cond.phase)
                    if (!checkCond) {
                        tempCond.push({ phase: buff.cond.phase })
                    }
                })

            })

            setPrintInfra(tempCond)
        }

        if (operator.talents) {
            let tempSearchTalent: PrintTalentBtn = {
                phase: [],
                potentialRank: []
            }

            operator.talents.map(talent => {
                talent.candidates.map(item => {
                    if (tempSearchTalent.phase.indexOf(item.unlockCondition.phase) === -1) {
                        tempSearchTalent.phase = [...tempSearchTalent.phase, item.unlockCondition.phase]
                    }
                    if (tempSearchTalent.potentialRank.indexOf(item.requiredPotentialRank) === -1) {
                        tempSearchTalent.potentialRank = [...tempSearchTalent.potentialRank, item.requiredPotentialRank]
                    }
                })
            })

            setPrintTalentBtn(tempSearchTalent)
        }
        console.dir(operator)


    }, [operator])

    useEffect(() => {
        if(printTalentBtn.phase) {
            setChooseTalentElite(Math.min(...printTalentBtn.phase))
        }
        if(printTalentBtn.potentialRank) {
            setChooseTalentPotential(Math.min(...printTalentBtn.potentialRank))
        }
        changeTalent()
    }, [printTalentBtn])

    useEffect(() => {
        changePrintInfra()
    }, [chooseInfraElite])

    useEffect(() => {
        if (stackGrid) {
            stackGrid.updateLayout()
        }
    }, [printFirstInfra, printSecondInfra, printTalentBtn, printTalent])

    useLayoutEffect(() => {
        const handleResize = () => {
            if (detailWrapRef.current) {
                setClientWidth(detailWrapRef.current.offsetWidth)
            }

        }

        handleResize()

        window.addEventListener("resize", handleResize)
    }, [])

    const rangeGrideInfo = {
        minRow: 0,
        minCol: 0,
        maxRow: 0,
        maxCol: 0,
        rangeInfo: {} as RangeInfo
    }

    // SkinChange
    const changeSkinPreview = (skinInfo: any) => {
        setPreviewImage(`url('${process.env.NEXT_PUBLIC_CLOUD_URL}characters/${skinInfo['portraitId'].replace('#', '%23')}.png')`)
    }

    // EliteChange
    const clickEliteEvent = (elite: number) => {
        setChooseElite(elite)
        changeElite(elite)
    }

    const clickInfraElite = (elite: number) => {
        setChooseInfraElite(elite)
    }

    const clickTalentElite = (elite: number) => {
        setChooseTalentElite(elite)
    }

    const clickTalentPotential = (potential: number) => {
        setChooseTalentPotential(potential)

    }

    const changeTalent = () => {
        let printTalentSaerch: Candidate[] = []
        operator.talents.map(candidates => {

            let checkSearched = candidates.candidates.filter(obj => obj.requiredPotentialRank <= chooseTalentPotential && obj.unlockCondition.phase <= chooseTalentElite)
                .reduce((prev: Candidate | null, current: Candidate) => {
                    // console.log("check init ::")
                    // console.log(current)

                    // console.log("check of/off")
                    // console.log("current.unlockCondition.phase <= chooseTalentElite ==> ", current.unlockCondition.phase <= chooseTalentElite)
                    // console.log("current.requiredPotentialRank <= chooseTalentPotential ==> ", current.requiredPotentialRank <= chooseTalentPotential)
                    // if(prev) {
                    //     console.log("(prev.unlockCondition.phase < current.unlockCondition.phase) ==> ", (prev.unlockCondition.phase < current.unlockCondition.phase))
                    //     console.log("(prev.requiredPotentialRank < current.requiredPotentialRank) ==> ", (prev.requiredPotentialRank < current.requiredPotentialRank))
                    // }

                    if (
                        (current.unlockCondition.phase <= chooseTalentElite) &&
                        (current.requiredPotentialRank <= chooseTalentPotential) &&
                        (!prev || (prev.unlockCondition.phase < current.unlockCondition.phase) || (prev.requiredPotentialRank < current.requiredPotentialRank))) {
                        // 조건문 검사 다시 해야 함.. 이게 맞나?
                        return current
                    }
                    return prev
                }, null)


            if (checkSearched) {
                printTalentSaerch = [...printTalentSaerch, checkSearched]
            }

        })

        setPrintTalent(printTalentSaerch)
    }


    const changePrintInfra = () => {
        // 가장 큰 값을 찾는다.
        let printFirstInfraSearch = results.infra.chars[searchId].buffChar[0].buffData.filter(obj => obj.cond.phase <= chooseInfraElite)
            .reduce((prev: BuffDaum | null, current: BuffDaum) => {
                if (current.cond.phase <= chooseInfraElite && (!prev || prev.cond.phase < current.cond.phase)) {
                    return current
                }
                return prev
            }, null)

        if (!printFirstInfraSearch) {
            setPrintFirstInfra(null)
        } else {
            setPrintFirstInfra(printFirstInfraSearch?.infra as Infra)
        }

        let printSecondInfraSearch = results.infra.chars[searchId].buffChar[1].buffData.filter(obj => obj.cond.phase <= chooseInfraElite)
            .reduce((prev: BuffDaum | null, current: BuffDaum) => {
                if (current.cond.phase <= chooseInfraElite && (!prev || prev.cond.phase < current.cond.phase)) {
                    return current
                }
                return prev
            }, null)

        if (!printSecondInfraSearch) {
            setPrintSecondInfra(null)
        } else {
            setPrintSecondInfra(printSecondInfraSearch?.infra as Infra)
        }

    }

    const changeElite = (elite: number) => {
        if (operator) {
            switch (elite) {
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

    const changeRangeElite = (elite: number) => {
        if (operator) {
            operator.rangeInfo.map((range: RangeInfo) => {
                if (range.id === operator.phases[elite].rangeId) {
                    setNowRange(range)
                    return false
                }
            })
        }
    }

    const transferPosition = (position: string) => {
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
        changeTalent()
    }, [chooseTalentElite, chooseTalentPotential])

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
                <div className={style.operatorDetailWrap} ref={detailWrapRef}>
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
                                            {operator.phases.length >= 1 ? <li className={chooseElite === 0 ? style.active : ''}><Image src="/sample/elite/0-s.png" width={40} height={40} alt="elite-0" onClick={() => clickEliteEvent(0)}></Image></li> : <></>}
                                            {operator.phases.length >= 2 ? <li className={chooseElite === 1 ? style.active : ''}><Image src="/sample/elite/1-s.png" width={40} height={40} alt="elite-1" onClick={() => clickEliteEvent(1)}></Image></li> : <></>}
                                            {operator.phases.length >= 3 ? <li className={chooseElite === 2 ? style.active : ''}><Image src="/sample/elite/2-s.png" width={40} height={40} alt="elite-2" onClick={() => clickEliteEvent(2)}></Image></li> : <></>}
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
                                                operator.tagList.map((tag: string, index: number) => {
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

                    <StackGrid
                        gridRef={grid => setStackGrid(grid)}
                        className={style.operatorBasicInfoWrap}
                        columnWidth={clientWidth <= 960 ? '100%' : '50%'}
                        gutterWidth={15}
                        gutterHeight={15}

                    >

                        <div className={style.operatorBasicInfoBox}>
                            <h4 className={style.operatorBasicInfoTitle}>기본 정보</h4>

                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>Choose Elite</h5>
                                {
                                    operator && <>
                                        <div className={style.choosePhasesWrap}>
                                            <ul>
                                                {operator.phases.length >= 1 ? <li className={chooseElite === 0 ? style.active : ''}><Image src="/sample/elite/0-s.png" width={40} height={40} alt="elite-0"></Image></li> : <></>}
                                                {operator.phases.length >= 2 ? <li className={chooseElite === 1 ? style.active : ''}><Image src="/sample/elite/1-s.png" width={40} height={40} alt="elite-1"></Image></li> : <></>}
                                                {operator.phases.length >= 3 ? <li className={chooseElite === 2 ? style.active : ''}><Image src="/sample/elite/2-s.png" width={40} height={40} alt="elite-2"></Image></li> : <></>}
                                            </ul>
                                        </div>
                                    </>
                                }
                            </div>

                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>LEVEL</h5>
                                <div className={style.levelSliderWrap}>
                                    <div className={style.levelSlider}>
                                        <div>
                                            <RangeSlider
                                                value={level}
                                                onChange={changeEvent => setLevel(parseInt(changeEvent.target.value))}
                                                min={1}
                                                max={50}>
                                            </RangeSlider>
                                        </div>
                                        <div>
                                            <input type="number" className="form-control" value={level}></input>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>STATUS</h5>
                                <div className={style.statusOutterWrap}>
                                    <div className={style.statusInnerWrap}>

                                        <div className={style.statusInfo}>
                                            <div className={style.statusTitle}>최대 체력</div>
                                            <div className={style.status}>10</div>
                                        </div>

                                        <div className={style.statusInfo}>
                                            <div className={style.statusTitle}>재배치</div>
                                            <div className={style.status}>10</div>
                                        </div>

                                        <div className={style.statusInfo}>
                                            <div className={style.statusTitle}>공격</div>
                                            <div className={style.status}>10</div>
                                        </div>

                                        <div className={style.statusInfo}>
                                            <div className={style.statusTitle}>배치 코스트</div>
                                            <div className={style.status}>10</div>
                                        </div>

                                        <div className={style.statusInfo}>
                                            <div className={style.statusTitle}>방어</div>
                                            <div className={style.status}>10</div>
                                        </div>

                                        <div className={style.statusInfo}>
                                            <div className={style.statusTitle}>저지 가능 수</div>
                                            <div className={style.status}>10</div>
                                        </div>

                                        <div className={style.statusInfo}>
                                            <div className={style.statusTitle}>마법 저항</div>
                                            <div className={style.status}>10</div>
                                        </div>

                                        <div className={style.statusInfo}>
                                            <div className={style.statusTitle}>공격 속도</div>
                                            <div className={style.status}>10</div>
                                        </div>

                                    </div>
                                </div>

                                <div className={style.eliteRequirementBoxWrap}>
                                    <div className={style.eliteRequirementBoxTitleWrap}>
                                        정예화 필요 재료
                                    </div>
                                    <div className={style.eliteRequirementBoxContent}>

                                        <div className={style.eliteRequirementBoxItemWrap}>
                                            <div className={style.eliteRequirementImageWrap} style={{ backgroundImage: `url(/sample/material/bg/item-1.png)` }}>
                                                <Image src={`/sample/item/MTL_SL_DS.png`} alt={`item-image`} width={70} height={70}></Image>
                                                <div className={style.eliteRequirementItemCount}>7</div>
                                            </div>
                                            <div className={style.eliteRequirementItemTitle}>
                                                용문폐
                                            </div>
                                        </div>

                                        <div className={style.eliteRequirementBoxItemWrap}>
                                            <div className={style.eliteRequirementImageWrap} style={{ backgroundImage: `url(/sample/material/bg/item-1.png)` }}>
                                                <Image src={`/sample/item/MTL_SL_DS.png`} alt={`item-image`} width={70} height={70}></Image>
                                                <div className={style.eliteRequirementItemCount}>180000</div>
                                            </div>
                                            <div className={style.eliteRequirementItemTitle}>
                                                용문폐
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className={style.operatorBasicInfoBox}>
                            <h4 className={style.operatorBasicInfoTitle}>잠재능력 및 신뢰도</h4>
                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>특성</h5>
                                <div className={style.contentBox} >
                                    <div dangerouslySetInnerHTML={{ __html: operator.description }}></div>
                                </div>
                            </div>
                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>잠재능력</h5>
                                <div className={`${style.contentBox} ${style.potentialBox}`}>
                                    {operator.potentialRanks.map((item, index) => {
                                        return <>
                                            <div>
                                                <Image key={index} src={`/sample/potential/${index + 1}.png`} alt='potentials-icon' width={20} height={20}></Image>
                                                <p>{item.description}</p>
                                            </div>
                                        </>
                                    })}


                                </div>
                            </div>
                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>신뢰도</h5>
                                <div className={style.contentBox}>
                                    {
                                        Object.entries(trustInfo as Record<string, any>).map(([key, value]) => {
                                            if (value) {
                                                return <div key={key}>
                                                    {key}:+{value}
                                                </div>
                                            }
                                        })
                                    }

                                </div>
                            </div>
                        </div>

                        {printTalent && <div className={style.operatorBasicInfoBox}>
                            <h4 className={style.operatorBasicInfoTitle}>재능</h4>
                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>Choose Elite</h5>
                                <div className={style.choosePhasesWrap}>
                                    <ul>
                                        {
                                            printTalentBtn.phase.map(phase => {
                                                return <>
                                                    <li className={chooseTalentElite === phase ? style.active : ''}><Image src={`/sample/elite/${phase}-s.png`} width={40} height={40} alt="elite-0" onClick={() => { clickTalentElite(phase) }}></Image></li>
                                                </>
                                            })
                                        }


                                    </ul>
                                </div>
                            </div>

                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>Choose Tanlent</h5>
                                <div className={style.choosePhasesWrap}>
                                    <ul>
                                        {
                                            printTalentBtn.potentialRank.map(potential => {
                                                return <>
                                                    <li className={chooseTalentPotential === potential ? style.active : ''}><Image src={`/sample/potential/${potential + 1}.png`} width={40} height={40} alt="elite-0" onClick={() => { clickTalentPotential(potential) }}></Image></li>
                                                </>

                                            })
                                        }

                                    </ul>
                                </div>
                            </div>

                            <div className={style.operatorBoxContent}>

                                {printTalent.map(talent => {
                                    return <>
                                        <div className={style.tanlentBoxWrap}>
                                        <div className={style.tanlentBox}>
                                            <div className={style.tanlentTitle}>
                                                <span>{talent.name}</span>
                                                <div className={style.tanlentPotentialIcon}>
                                                    <Image src={`/sample/elite/${talent.unlockCondition.phase}-s.png`} alt='potential-icon' width={18} height={18}></Image>
                                                </div>
                                                <div className={style.tanlentPotentialIcon}>
                                                    <Image src={`/sample/potential/${talent.requiredPotentialRank+1}.png`} alt='potential-icon' width={18} height={18}></Image>
                                                </div>
                                            </div>
                                            <div className={style.tanlentContent} dangerouslySetInnerHTML={{__html:replaceTalentDescription(talent.description)}}></div>
                                        </div>
                                    </div>
                                    </>
                                })}
                                

                            </div>

                        </div>}


                        {(printFirstInfra || printSecondInfra) &&
                            <div className={style.operatorBasicInfoBox}>
                                <h4 className={style.operatorBasicInfoTitle}>인프라 스킬</h4>
                                <div className={style.choosePhasesWrap}>

                                    <ul>
                                        {
                                            printInfra.map(phase => {
                                                return <>
                                                    <li className={chooseInfraElite === phase.phase ? style.active : ''}><Image src={`/sample/elite/${phase.phase}-s.png`} width={40} height={40} alt='elite-image' onClick={() => clickInfraElite(phase.phase)}></Image></li>
                                                </>
                                            })
                                        }

                                    </ul>

                                </div>
                                <div className={style.infraSkillBoxWrap}>

                                    {
                                        printFirstInfra && <div className={style.infraSkillBox}>

                                            <div className={style.infraSkillTitleWrap}>
                                                <div className={style.infraSKillIcon}>
                                                    <Image src={`${process.env.NEXT_PUBLIC_CLOUD_URL}ui/infrastructure/skill/${printFirstInfra.skillIcon}.png`} alt='infra-skill-icon' width={20} height={20}></Image>
                                                </div>
                                                <div className={style.infraSkillTitle}>{printFirstInfra.buffName}</div>
                                            </div>
                                            <div className={style.infraSkillContent} dangerouslySetInnerHTML={{ __html: replaceInfraDescription(printFirstInfra.description) }}>

                                            </div>
                                        </div>
                                    }

                                    {
                                        printSecondInfra && <div className={style.infraSkillBox}>

                                            <div className={style.infraSkillTitleWrap}>
                                                <div className={style.infraSKillIcon}>
                                                    <Image src={`${process.env.NEXT_PUBLIC_CLOUD_URL}ui/infrastructure/skill/${printSecondInfra.skillIcon}.png`} alt='infra-skill-icon' width={20} height={20}></Image>
                                                </div>
                                                <div className={style.infraSkillTitle}>{printSecondInfra.buffName}</div>
                                            </div>
                                            <div className={style.infraSkillContent} dangerouslySetInnerHTML={{ __html: replaceInfraDescription(printSecondInfra.description) }}>

                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>}


                        {/* <div className={style.operatorBasicInfoBox}>
                            <h4 className={style.operatorBasicInfoTitle}>스킬</h4>
                        </div>

                        <div className={style.operatorBasicInfoBox}>
                            <h4 className={style.operatorBasicInfoTitle}>모듈</h4>
                        </div> */}
                    </StackGrid>

                </div>
            </ContentLayout>
        </PageLayout>
    </>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // GET Operator Data
    const id = context.params ? context.params._id as string : ''
    const operator: OperatorDetail = await getOperatorDetail(id)

    const searchId = operator.potentialItemId.slice(2)

    let infraInfo: InfraType | null = null
    try {
        infraInfo = await getInfraInfo(searchId)
    } catch (err: any) {

    }



    // operator.phases 반복, 안에서 evolveCost 반복, id값 캐치
    let itemIds: string[] = []

    operator.phases.map(phase => {
        if (phase.evolveCost) {
            phase.evolveCost.map(cost => {
                itemIds = [...itemIds, cost.id]
            })
        }
    })

    // Item 정보 가져오기
    let itemInfo: Items | null = null
    try {
        const itemInfo = await getItemInfo(itemIds)
    } catch (err: any) {

    }

    // 맞는 데이터 세팅
    operator.phases.map(phase => {
        if (phase.evolveCost) {
            phase.evolveCost.map(cost => {
                if (itemInfo) {
                    cost.item = itemInfo.find(obj => obj.itemId === cost.id)
                }
            })
        }
    })


    const pattern = /<@ba.kw>(.*?)<\/>/g;
    const jsx = "<span class='text-color'>$1</span>"
    operator.description = operator.description.replace(pattern, jsx)

    return {
        props: {
            results: {
                operator: operator,
                infra: infraInfo,
                itemInfo: itemInfo
            }
        }
    }

}