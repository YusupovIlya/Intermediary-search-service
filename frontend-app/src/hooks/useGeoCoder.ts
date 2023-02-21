import {useEffect, useState} from 'react';
import axios from 'axios'

export interface ResponseAPI {
    data: IPlace[]
}

export interface IPlace {
    latitude: number;
    longitude: number;
    type: string;
    name: string;
    number: string;
    postal_code?: any;
    street: string;
    confidence: number;
    region: string;
    region_code: string;
    county: string;
    locality: string;
    administrative_area: string;
    neighbourhood: string;
    country: string;
    country_code: string;
    continent: string;
    label: string;
}

export function useGeoCoder(queryStr: string) {
    const api_url = "http://api.positionstack.com/v1/forward";
    const [places, setPlaces] = useState<IPlace[]>([]);
    const [loading, setLoading] = useState(false);
  
    async function fetchPlaces() {
        const params = {
            access_key: process.env.REACT_APP_API_KEY_GEOCODER!,
            query: queryStr
        };
        const full_url = api_url + '?' + new URLSearchParams(params);
        setLoading(true);
        const response = await axios.get<ResponseAPI>(full_url, {
            proxy:{
                protocol: 'https',
                host: process.env.REACT_APP_PROXY_IP!,
                port: Number(process.env.REACT_APP_PROXY_PORT),
            }
        });
        setPlaces(response.data.data);
        setLoading(false);
    }
  
    useEffect(() => {
        fetchPlaces()
    }, [queryStr])
  
    return { places, loading }
  }