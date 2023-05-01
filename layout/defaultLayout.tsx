import Footer from "../components/footer"
import CommonNav from "../components/commonNav";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <CommonNav/>
                {children}
            <Footer/>
        </div>
    )
}