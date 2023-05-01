import ContentLayout from "./contentLayout";
import PageLayout from "./pageLayout";

export default function DevelopingLayout() {
    return <>
        <PageLayout>
            <ContentLayout>
                <div>개발 진행 중 입니다.</div>
            </ContentLayout>
        </PageLayout>
    </>
}