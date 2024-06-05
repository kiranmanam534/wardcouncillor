import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "./api";

export const GetAnnouncementVewInfoApi = createAsyncThunk(
    'api/CouncillorWard/GetAnnouncementVewInfo',
    async params => {
        try {
            const { userId, type, search, page, limit } = params;
            console.log(userId, type, page, limit, search);
            let URL = '';
            if (type == 'Hotspots') {
                URL = `api/Hotspot/get-hotspot-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Road Closure') {
                URL = `api/RoadClosure/get-road-closure-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Meetings') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Missing Person') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Workshops') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Warnings') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Healthcare') {
                URL = `api/Healthcare/get-healthcare-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            }
            console.log(URL);

            const response = await AxiosInstance.get(URL);

            return response.data;
        } catch (error) {
            console.log('Error:', error.response.data);
            return error.response.data;
        }
    },
);


export const GetAnnouncementImagesApi = createAsyncThunk(
    'api/CouncillorWard/GetAnnouncementImagesApi',
    async params => {
        try {
            const { userId, type } = params;
            console.log(userId, type);
            let URL = '';
            if (type == 'Hotspots') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${userId}`;
            } else if (type == 'Healthcare') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${userId}`;
            } else if (type == 'Road Closure') {
                URL = `api/RoadClosure/get-road-closure-image-data?ID=${userId}`;
            } else if (type == 'Meter') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${userId}`;
            } else if (type == 'Customer') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${userId}`;
            } else if (type == 'Property') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${userId}`;
            } else if (type == 'MetersNotRead') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${userId}`;
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


export const DeleteAnnouncementApi = createAsyncThunk(
    'api/CouncillorWard/DeleteAnnouncementApi',
    async params => {
        try {
            const { Id, type } = params;
            console.log(Id, type);
            let URL = '';
            if (type == 'Hotspots') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
            } else if (type == 'Healthcare') {
                URL = `api/Healthcare/delete-healthcare-data?ID=${Id}`;
            } else if (type == 'IMS') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
            } else if (type == 'Meter') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
            } else if (type == 'Customer') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
            } else if (type == 'Property') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
            } else if (type == 'MetersNotRead') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
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
