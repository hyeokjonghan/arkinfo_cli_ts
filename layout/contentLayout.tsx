import contentLayoutCss from "@/styles/layout/content.module.scss"
import { AppProps } from "next/app"
import { ReactNode } from "react"

export default function ContentLayout({ children }: { children: ReactNode }) {
    return (
        <div className={contentLayoutCss.contentLayout}>
            <div className={`container-xl`}>
                {children}
            </div>
        </div>
    )
}