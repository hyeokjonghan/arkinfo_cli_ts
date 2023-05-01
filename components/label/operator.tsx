import style from "@/styles/component/label/operatorLabel.module.scss"
import PropTypes from 'prop-types'
import Image from 'next/image'
export default function OperatorLabel ({opInfo}: any) {
    let rarityClass = ''
    switch(opInfo.rarity) {
        case 0:
            rarityClass = style.rarity1
            break;
        case 1:
            rarityClass = style.rarity2
            break;
        case 2:
            rarityClass = style.rarity3
            break;
        case 3:
            rarityClass = style.rarity4
            break;
        case 4:
            rarityClass = style.rarity5
            break;
        case 5:
            rarityClass = style.rarity6
            break;
    }
    return <>
        <div className={`${style.opLabel} ${rarityClass}`}>
            <div>
                {opInfo.name}
            </div>
            <div className={style.rankWrap}>
                <Image src={`/ui/star.png`} width="20" height="20" alt="star"></Image>
                <span>{opInfo.rarity + 1}</span>
            </div>
        </div>
    </>
}

OperatorLabel.propTypes = {
    opInfo: PropTypes.object.isRequired
}