import api from "./axios"

export interface Table {
    id: number;
    capacity: number;
    location: string;
}

export const getTables = async (): Promise<Table[]> => {
    try {
        const response = await api.get<{ data: Table[] }>(`/tables`)
        return response.data.data
    } catch (error) {
        console.error("Error fetching tables:", error)
        throw error
    }
}

