import Head from 'next/head'
import { Inter } from 'next/font/google'
import ContentLayout from '@/layout/contentLayout'
import PageLayout from '@/layout/pageLayout'
import style from '@/styles/main.module.scss'
import IndexCard from '@/components/card/indexCard'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const indexCardInfo = [
    {
      image:'/sample/recruitment.jpg',
      title:'공개모집 태그 계산기',
      path:'/recruitment',
      content:[
        "공개모집 태그별 모집 가능한 오퍼레이터 목록 제공",
        "4성 이상 확정 필터링",
        "이미지 노출 ON/OFF"
      ]
    },
    {
      image:'/sample/operator.jpg',
      title:'오퍼레이터 목록',
      path:'/operator',
      content:[
        "개발 준비중 입니다."
      ]
    },
    {
      image:'/sample/material.jpg',
      title:'재료',
      path:'/material',
      content:[
        "개발 준비중 입니다."
      ]
    },
    {
      image:'/sample/enemy.jpg',
      title:'적 정보',
      path:'/enemy',
      content:[
        "개발 준비중 입니다."
      ]
    },
  ]

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PageLayout>
            <ContentLayout>
              <div className={style.indexCardWrap}>

                {indexCardInfo.map((item, index) => {
                  return <>
                    <IndexCard key={index} cardInfo={item}></IndexCard>
                  </>
                })}

              </div>
            </ContentLayout>
          </PageLayout>
      </main>
    </>
  )
}
