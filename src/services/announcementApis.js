import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "./api";

export const GetAnnouncementVewInfoApi = createAsyncThunk(
    'api/CouncillorWard/GetAnnouncementVewInfo',
    async params => {
        try {
            const { userId, type, search, page, limit } = params;
            console.log(userId, type, page, limit,search);
            let URL = '';
            if (type == 'Hotspots') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Healthcare') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${10}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'IMS') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Meter') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Customer') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Property') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'MetersNotRead') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            }
            console.log(URL);

            const response = await AxiosInstance.get(URL);

            return response.data;
        } catch (error) {
            console.log('Error:', error.response.data);
            throw error.response.data;
        }
    },
);