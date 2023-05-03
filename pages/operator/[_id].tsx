import RangeSlider from 'react-bootstrap-range-slider';
import ContentLayout from "@/layout/contentLayout"
import PageLayout from "@/layout/pageLayout"
import { useRouter } from "next/router"
import style from "@/styles/operator/detail.module.scss"
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { useGetOperatorDetail, getOperatorDetail } from "../api/operator"
import { OperatorDetail, RangeInfo, SkinInfo } from "@/types/opInfo"
import StackGrid from "react-stack-grid"
import { GetServerSidePropsContext } from 'next';
type ssrType = {
    operator: OperatorDetail
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
    }, [operator])

    useLayoutEffect(() => {
        const handleResize = () => {
            if (detailWrapRef.current) {
                setClientWidth(detailWrapRef.current.offsetWidth)
            }
        }

        handleResize()

        window.addEventListener("resize", handleResize)
    })

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
                                            <div className={style.eliteRequirementImageWrap} style={{backgroundImage:`url(/sample/material/bg/item-1.png)`}}>
                                                <Image src={`/sample/item/MTL_SL_DS.png`} alt={`item-image`} width={70} height={70}></Image>
                                                <div className={style.eliteRequirementItemCount}>7</div>
                                            </div>
                                            <div className={style.eliteRequirementItemTitle}>
                                                용문폐
                                            </div>
                                        </div>

                                        <div className={style.eliteRequirementBoxItemWrap}>
                                            <div className={style.eliteRequirementImageWrap} style={{backgroundImage:`url(/sample/material/bg/item-1.png)`}}>
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
                                <div className={style.contentBox}>
                                    특성특성
                                </div>
                            </div>
                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>잠재능력</h5>
                                <div className={`${style.contentBox} ${style.potentialBox}`}>
                                    <div>
                                        <Image src={`/sample/potential/1.png`} alt='potentials-1' width={20} height={20}></Image>
                                        <p>잠재능력 1각</p>
                                    </div>
                                    <div>
                                        <Image src={`/sample/potential/2.png`} alt='potentials-2' width={20} height={20}></Image>
                                        <p>잠재능력 1각</p>
                                    </div>
                                    <div>
                                        <Image src={`/sample/potential/3.png`} alt='potentials-3' width={20} height={20}></Image>
                                        <p>잠재능력 1각</p>
                                    </div>
                                    <div>
                                        <Image src={`/sample/potential/4.png`} alt='potentials-4' width={20} height={20}></Image>
                                        <p>잠재능력 1각</p>
                                    </div>
                                    <div>
                                        <Image src={`/sample/potential/5.png`} alt='potentials-5' width={20} height={20}></Image>
                                        <p>잠재능력 1각</p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>신뢰도</h5>
                                <div className={style.contentBox}>
                                    <div>Attack +35</div>
                                    <div>Attack +35</div>
                                </div>
                            </div>
                        </div>

                        <div className={style.operatorBasicInfoBox}>
                            <h4 className={style.operatorBasicInfoTitle}>재능</h4>
                            <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>Choose Elite</h5>
                                <div className={style.choosePhasesWrap}>
                                    <ul>
                                        {operator.phases.length >= 1 ? <li className={chooseElite === 0 ? style.active : ''}><Image src="/sample/elite/0-s.png" width={40} height={40} alt="elite-0"></Image></li> : <></>}
                                        {operator.phases.length >= 2 ? <li className={chooseElite === 1 ? style.active : ''}><Image src="/sample/elite/1-s.png" width={40} height={40} alt="elite-1"></Image></li> : <></>}
                                        {operator.phases.length >= 3 ? <li className={chooseElite === 2 ? style.active : ''}><Image src="/sample/elite/2-s.png" width={40} height={40} alt="elite-2"></Image></li> : <></>}
                                    </ul>
                                </div>
                            </div>
                            {/* <div className={style.operatorBoxContent}>
                                <h5 className={style.operatorBoxTitle}>Choose Tanlent</h5>
                                <div className={style.choosePhasesWrap}>
                                    <ul>
                                        {operator.phases.length >= 1 ? <li className={chooseElite === 0 ? style.active : ''}><Image src="/sample/potential/1.png" width={40} height={40} alt="potential-0"></Image></li> : <></>}
                                    </ul>
                                </div>
                            </div> */}
                            <div className={style.operatorBoxContent}>
                                <div className={style.tanlentBoxWrap}>
                                    <div className={style.tanlentBox}>
                                        <div className={style.tanlentTitle}>
                                            <span>재능 명</span>
                                            <div className={style.tanlentPotentialIcon}>
                                                <Image src="/sample/potential/1.png" alt='potential-icon' width={18} height={18}></Image>
                                            </div>
                                        </div>
                                        <div className={style.tanlentContent}>
                                            재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...
                                        </div>
                                    </div>

                                    <div className={style.tanlentBox}>
                                        <div className={style.tanlentTitle}>
                                            <span>재능 명</span>
                                            <div className={style.tanlentPotentialIcon}>
                                                <Image src="/sample/potential/1.png" alt='potential-icon' width={18} height={18}></Image>
                                            </div>
                                        </div>
                                        <div className={style.tanlentContent}>
                                            재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...재능 내용...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={style.operatorBasicInfoBox}>
                            <h4 className={style.operatorBasicInfoTitle}>인프라 스킬</h4>
                            <div className={style.choosePhasesWrap}>
                                <ul>
                                    {operator.phases.length >= 1 ? <li className={chooseElite === 0 ? style.active : ''}><Image src="/sample/elite/0-s.png" width={40} height={40} alt="elite-0"></Image></li> : <></>}
                                    {operator.phases.length >= 2 ? <li className={chooseElite === 1 ? style.active : ''}><Image src="/sample/elite/1-s.png" width={40} height={40} alt="elite-1"></Image></li> : <></>}
                                    {operator.phases.length >= 3 ? <li className={chooseElite === 2 ? style.active : ''}><Image src="/sample/elite/2-s.png" width={40} height={40} alt="elite-2"></Image></li> : <></>}
                                </ul>
                            </div>
                            <div className={style.infraSkillBoxWrap}>

                                <div className={style.infraSkillBox}>
                                    <div className={style.infraSkillTitleWrap}>
                                        <div className={style.infraSKillIcon}>
                                            <Image src={`/sample/infrastructure/bskill_ctrl_cost.png`} alt='infra-skill-icon' width={20} height={20}></Image>
                                        </div>
                                        <div className={style.infraSkillTitle}>infra skill title</div>
                                    </div>
                                    <div className={style.infraSkillContent}>
                                        내용내용
                                    </div>
                                </div>

                                <div className={style.infraSkillBox}>
                                    <div className={style.infraSkillTitleWrap}>
                                        <div className={style.infraSKillIcon}>
                                            <Image src={`/sample/infrastructure/bskill_ctrl_cost.png`} alt='infra-skill-icon' width={20} height={20}></Image>
                                        </div>
                                        <div className={style.infraSkillTitle}>infra skill title</div>
                                    </div>
                                    <div className={style.infraSkillContent}>
                                        내용내용
                                    </div>
                                </div>

                            </div>
                        </div>

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
    const operator = await getOperatorDetail(id)

    return {
        props: {
            results: {
                operator: operator as OperatorDetail
            }
        }
    }
}