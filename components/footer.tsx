import style from "@/styles/footer.module.scss"
export default function footer() {
    return (
        <div className={style.footerWrap}>
            <div className="container-xl">
                <div className={style.footerContentWrap}>
                    <span><span>Contact : </span>jjong2028@gmail.com</span>
                    <span>© 2020-2023 JJONG2028</span>
                </div>
            </div>
        </div>
    )
}