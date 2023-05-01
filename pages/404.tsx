import ContentLayout from "../layout/contentLayout";
import PageLayout from "../layout/pageLayout";

export default function NotFoundPage() {
    return <>
    <PageLayout>
        <ContentLayout>
            <div>페이지를 찾을 수 없습니다.</div>
        </ContentLayout>
    </PageLayout>
    </>
}