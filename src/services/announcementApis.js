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
                URL = `api/Meeting/get-meeting-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Missing Person') {
                URL = `api/MissingPerson/get-missing-person-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Workshops') {
                URL = `api/Workshop/get-workshop-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
            } else if (type == 'Warnings') {
                URL = `api/Warning/get-warning-data?UserID=${userId}&page=${page}&limit=${limit}&search=${search}`;
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
            console.log('api/CouncillorWard/GetAnnouncementImagesAp',userId, type);
            let URL = '';
            if (type == 'Hotspots') {
                URL = `api/Hotspot/get-hotspot-image-data?ID=${userId}`;
            } else if (type == 'Healthcare') {
                URL = `api/Healthcare/get-healthcare-image-data?ID=${userId}`;
            } else if (type == 'Road Closure') {
                URL = `api/RoadClosure/get-road-closure-image-data?ID=${userId}`;
            } else if (type == 'Meetings') {
                URL = `api/Meeting/get-meeting-image-data?ID=${userId}`;
            } else if (type == 'Missing Person') {
                URL = `api/MissingPerson/get-missing-person-image-data?ID=${userId}`;
            } else if (type == 'Workshops') {
                URL = `api/Workshop/get-workshop-image-data?ID=${userId}`;
            } else if (type == 'Warnings') {
                URL = `api/Warning/get-warning-image-data?ID=${userId}`;
            }
            console.log('URL==>',URL);

            const response = await AxiosInstance.get(URL);

            return response.data;
        } catch (error) {
            console.log('Error:', error.response);
            throw error.response.data;
        }
    },
);


// export const DeleteAnnouncementApi = createAsyncThunk(
//     'api/CouncillorWard/DeleteAnnouncementApi',
//     async params => {
//         try {
//             const { Id, type } = params;
//             console.log(Id, type);
//             let URL = '';
//             if (type == 'Hotspots') {
//                 URL = `api/Hotspot/get-hotspot-image-data?ID=${Id}`;
//             } else if (type == 'Healthcare') {
//                 URL = `api/Healthcare/delete-healthcare-data?ID=${Id}`;
//             } else if (type == 'Road Closure') {
//                 URL = `api/RoadClosure/get-road-closure-image-data?ID=${Id}`;
//             } else if (type == 'Meetings') {
//                 URL = `api/Meeting/get-meeting-image-data?ID=${Id}`;
//             } else if (type == 'Missing Person') {
//                 URL = `api/MissingPerson/get-missing-person-image-data?ID=${Id}`;
//             } else if (type == 'Workshops') {
//                 URL = `api/Workshop/get-workshop-image-data?ID=${Id}`;
//             } else if (type == 'Warnings') {
//                 URL = `api/Warning/get-warning-image-data?ID=${Id}`;
//             } 
//             console.log(URL);

//             const response = await AxiosInstance.get(URL);

//             return response.data;
//         } catch (error) {
//             console.log('Error:', error.response.data);
//             throw error.response.data;
//         }
//     },
// );
