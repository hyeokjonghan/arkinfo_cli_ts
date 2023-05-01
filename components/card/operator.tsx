import style from "@/styles/component/card/operatorCard.module.scss"
import { OpInfo } from "@/types/opInfo"
import Image from "next/image"
import PropTypes from 'prop-types'

interface OperatorCardProps {
    opInfo: OpInfo;
  }

export default function OperatorCard({opInfo}: OperatorCardProps) {
    // Header. BG. Banner. Glow Setting
    let headerBg = ''
    let bg = ''
    let banner = ''
    let glow = ''

    switch(opInfo.rarity) {
        case 0:
            headerBg = "/ui/chara/header-1.png"
            bg = "/ui/chara/bg-1.png"
            banner = "/ui/chara/banner-1.png"
            glow = "/ui/chara/glow-1.png"
            break;
        case 1:
            headerBg = "/ui/chara/header-2.png"
            bg = "/ui/chara/bg-1.png"
            banner = "/ui/chara/banner-1.png"
            glow = "/ui/chara/glow-2.png"
            break;
        case 2:
            headerBg = "/ui/chara/header-3.png"
            bg = "/ui/chara/bg-1.png"
            banner = "/ui/chara/banner-1.png"
            glow = "/ui/chara/glow-3.png"
            break;
        case 3:
            headerBg = "/ui/chara/header-4.png"
            bg = "/ui/chara/bg-4.png"
            banner = "/ui/chara/banner-4.png"
            glow = "/ui/chara/glow-4.png"
            break;
        case 4:
            headerBg = "/ui/chara/header-5.png"
            bg = "/ui/chara/bg-5.png"
            banner = "/ui/chara/banner-5.png"
            glow = "/ui/chara/glow-5.png"
            break;
        case 5:
            headerBg = "/ui/chara/header-6.png"
            bg = "/ui/chara/bg-6.png"
            banner = "/ui/chara/banner-6.png"
            glow = "/ui/chara/glow-6.png"
            break;
        default:
            headerBg = "/ui/chara/header-6.png"
            bg = "/ui/chara/bg-6.png"
            banner = "/ui/chara/banner-6.png"
            glow = "/ui/chara/glow-6.png"
            break;
    }

    

    return <>
        <div className={style.operatorCardWrap}>
            <div className={style.operatorCard}>

                <div className={style.opCardImgWrap}>


                    <div className={style.operatorCardStarWrap}>
                        {
                            Array.apply(null, [opInfo.rarity+1]).map((e,i) => {
                                return <>
                                    <Image src={`/ui/star.png`} width="20" height="20" alt="star" key={i}></Image>
                                </>
                            })
                        }
                    </div>

                    
                    <div className={style.opCardImg}><Image src={opInfo.default_card_img} width="140" height="262" alt="op card image"></Image></div>
                    <div className={style.opCardBackWrap}><Image src={bg} width="140" height="253" alt="opBack"></Image></div>

                    <div className={style.operatorCardHeaderGradeImg}>
                        <Image src={headerBg} width="140" height="37" alt="op card header"></Image>
                    </div>
                    <div className={style.operatorCardHeaderGradeImgShadow}></div>

                    

                </div>

            </div>

            <div className={style.opCardInfoWrap}>
                <div className={style.opCardInfo}>
                    <div className={style.banner}><Image src={banner} width="155" height="116" alt="banner"></Image></div>
                    <div className={style.glow}><Image src={glow} width="142" height="122" alt="glow"></Image></div>
                    <div className={style.bottomBackground}></div>
                    <div className={style.opName}>{opInfo.name}</div>
                </div>
            </div>


        </div>
    </>
}

