import axios from "axios";
import { InfraType } from "@/types/infra"


export const getInfraInfo = async(id: string): Promise<InfraType> => {
    try {
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/operator/infra/${id}`)
        return data
    } catch (err: any) {
        throw new Error(err.response.status)
    }
}

