import style from "@/styles/component/operatorDetail/moduleInfo.module.scss"
import Image from "next/image"

export default function Module() {
    return <>
        <div className={style.moduleInfoWrap}>
            <div className={style.moduleSelectInfoWrap}>
                <div className={style.moduleSelectorWrap}>

                    <div className={`${style.moduleSelector} ${style.active}`}>
                        <div className={style.moduleClassImageWrap} style={{backgroundImage: `url('/sample/equip/shining/red_shining.png')`}}>
                            <Image src={`/sample/equip/type/arc-y.png`} width={30} height={30} alt='module-icon'></Image>
                        </div>
                        <div className={style.moduleClassTitle}>ORIGINAL</div>
                    </div>

                    <div className={`${style.moduleSelector}`}>
                    <div className={style.moduleClassImageWrap} style={{backgroundImage: `url('/sample/equip/shining/red_shining.png')`}}>
                            <Image src={`/sample/equip/type/arc-y.png`} width={30} height={30} alt='module-icon'></Image>
                        </div>
                        <div className={style.moduleClassTitle}>ORIGINAL</div>
                    </div>

                    <div className={`${style.moduleSelector}`}>
                    <div className={style.moduleClassImageWrap} style={{backgroundImage: `url('/sample/equip/shining/red_shining.png')`}}>
                            <Image src={`/sample/equip/type/arc-y.png`} width={30} height={30} alt='module-icon'></Image>
                        </div>
                        <div className={style.moduleClassTitle}>ORIGINAL</div>
                    </div>

                </div>
            </div>

            <div className={style.moduleContentBoxWrap}>
            <div className={style.moduleTitleWrap}>
                <div className={style.moduleImageWrap}>
                    <Image src={`/sample/equip/icon/default.png`} width={100} height={100} alt="모듈 아이템 이미지"></Image>
                    <div className={style.moreInfoBtn}><i className="bi bi-zoom-in"></i></div>
                </div>
                <div className={style.moduleTitle}>
                    <h5>모듈 명</h5>
                </div>
            </div>

            <div className={style.moduleStageBtnWrap}>
                <div className={`${style.moduleStageBtn} ${style.active}`}>
                    <div className={style.moduleStageLevel}>1</div>
                    <div className={style.moduleStageText}>STAGE</div>
                </div>
                <div className={`${style.moduleStageBtn}`}>
                    <div className={style.moduleStageLevel}>2</div>
                    <div className={style.moduleStageText}>STAGE</div>
                </div>
                <div className={`${style.moduleStageBtn}`}>
                    <div className={style.moduleStageLevel}>3</div>
                    <div className={style.moduleStageText}>STAGE</div>
                </div>
            </div>

            <div className={style.moduleContentWrap}>
                <div className={style.moduleContentBox}>
                    <div className={style.moduleContentBoxTitle}>Mission 1</div>
                    <div className={style.moduleContentBoxContent}></div>
                </div>

                {/* 이부분은 밖에꺼 따다가 써보기 */}
                <div className={style.moduleContentTitle}>필요 재화</div>
                <div>
                    <div>업그레이드 필요 재화</div>
                    <div>업그레이드 필요 재화 박스</div>
                </div>

                <div>
                    <div>Unlock Mission 박스</div>
                    <div>
                        <div>Unlock Mission 1</div>
                        <div>Unlock Mission 2</div>
                    </div>
                </div>
            </div>
            </div>

        </div>
    </>
}