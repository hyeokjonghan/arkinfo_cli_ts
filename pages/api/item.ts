import axios from "axios";
import {Items} from "@/types/item"


export const getItemInfo = async(item_ids: string[]): Promise<Items> => {
    try {
        const itemId = item_ids.map(item => `item_id[]=${item}`).join('&')
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/item/search?${itemId}`)
        return data
    } catch (err: any) {
        throw new Error(err.response.status)
    }
}

