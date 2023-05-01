import pageLayoutCss from "@/styles/layout/page.module.scss"
import Head from "next/head"
import PropTypes from 'prop-types'
import { ReactNode } from "react";

type MetaObject = { name: string, content: string };

type PageLayoutProps = {
  children?: ReactNode;
  meta?: MetaObject[];
  title?: string;
  metaImage?: MetaObject[];
}

export default function PageLayout({children, meta = [], title='Ark info', metaImage = []} : PageLayoutProps) {
    let metaList : MetaObject[] = [];

    // 기본 처리
    if(meta.length === 0) {
        metaList = [
            {
                name:"description",
                content:"명일방주 공개모집 태그 계산기, 오퍼레이터, 재료 등 정보 제공"
            },
            {
                name:"og:description",
                content:"명일방주 공개모집 태그 계산기, 오퍼레이터, 재료 등 정보 제공"
            },
            {
                name:"type",
                content:"website"
            },
            {
                name:"op:type",
                content:"website"
            },
            {
                name:"title",
                content:title
            },
            {
                name:"op:title",
                content:title
            },
            {
                name:"locale",
                content:"ko_KR"
            },
            {
                name:"og:locale",
                content:"ko_KR"
            }
        ]
    } 
    metaList.push(...meta)
    
    const printMetaJsx = metaList.map((meta) => {
        return <>
            <meta key={meta.name} name={meta.name} content={meta.content}></meta>
        </>
    })

    let metaImageList = metaImage
    if(metaImageList.length === 0) {
        metaImageList = [
            {
                name:"image",
                content:"/logo_rhodes.png"
            },
            {
                name:"op:image",
                content:"/logo_rhodes.png"
            }
        ]
    }
    

    return <>
        <div>
            <Head>
                <title>{title}</title>
                {printMetaJsx}
            </Head>
            <div className={pageLayoutCss.pageLayoutWrap}>
                {children}
            </div>
        </div>
    </>
}

PageLayout.propTypes = {
    cardInfo: PropTypes.array
}