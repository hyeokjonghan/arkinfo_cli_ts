import { useQuery } from "react-query";
import axios from "axios";
import rootStore from "@/store/rootStore";
import {OperatorDetail} from "@/types/opInfo" 
const searchOpValue = rootStore.searchOp

// OperatorList 검색
export const getOperatorList = async () => {
    try {
        const params = searchOpValue.getSearchOption
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/operator/list`, {params})
        return data
    } catch (err :any) {
        throw new Error(err.response.status)
    }
}

export const useGetOperatorList = (onError: any, onSuccess: any) => {
    return useQuery(['operatorList', searchOpValue.getSearchOption.page, searchOpValue.getSearchOption.rarity, searchOpValue.getSearchOption.name, searchOpValue.getSearchOption.profession ], getOperatorList, {
        onError,
        onSuccess,
        refetchOnWindowFocus: false
    })
}

export const getOperatorDetail = async(id: string): Promise<OperatorDetail> => {
    try {
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/operator/${id}`)
        return data
    } catch (err: any) {
        throw new Error(err.response.status)
    }
}

export const useGetOperatorDetail = (
    onError: any,
    onSuccess: any,
    id: string
) => {
    const queryEnabled = Boolean(id)
    return useQuery(["operatorDetail", id], () => getOperatorDetail(id), {
        enabled: queryEnabled,
        onError,
        onSuccess,
        refetchOnWindowFocus: false
    })
}

