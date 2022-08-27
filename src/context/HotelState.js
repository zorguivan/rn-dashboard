import React, { createContext, useReducer } from 'react';
import HotelReducer from '../Reducer/HotelReducer';
import axios from 'axios'

const initialState = {
    hotels: null,
    error: null
}

export const HotelContext = createContext(initialState);

export const HotelProvider = ({ children }) => {
    const [state, dispatch] = useReducer(HotelReducer, initialState);

    async function getHotels() {
        const data = await axios.get("/api/hotels")
            .then(res => {
                dispatch({
                    type: 'HOTELS_LOADED',
                    payload: res.data
                })
                return res.data;
            }).catch(() => dispatch({
                type: 'HOTELS_ERROR',
            }))
        return data;
    }

    async function getHotel(id) {
        const data = await axios.get("/api/hotels/" + id)
            .then(res => {
                dispatch({
                    type: 'BLOG_LOADED',
                    payload: res.data
                })
                return res.data;
            }).catch(() => dispatch({
                type: 'HOTELS_ERROR',
            }))
        return data;
    }

    async function getMessages() {
        const data = await axios.get("/api/messages/")
            .then(res => {
                dispatch({
                    type: 'MESSAGES_LOADED',
                    payload: res.data
                })
                return res.data;
            }).catch(() => dispatch({
                type: 'MESSAGES_ERROR',
            }))
        return data;
    }
    async function uploadFile(formData, id) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const data = await axios.put('/api/upload/' + id, formData, config)
            .then(res => {
                dispatch({
                    type: 'UPLOAD_SUCCESS',
                    payload: res.data
                });
                getUserInfo(id)
                return res;
            }).catch(err => {
                dispatch({
                    type: 'UPLOAD_FAIL',
                    payload: err,
                });
            });
        return data;

    }

    async function saveHotel(formDataa) {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const formData = new FormData()
        formData.append('name', formDataa.name)
        formData.append('description', formDataa.description)
        formData.append('location', formDataa.location)
        var json_arr = JSON.stringify(formDataa.rooms);
        formData.append('rooms', json_arr)
        if(formDataa.image){
            formData.append('image', formDataa.image)
        }
        const data = await axios.put('/api/hotel/' + formDataa._id, formData, config)
            .then(res => {
                dispatch({
                    type: 'HOTELSAVE_SUCCESS',
                    payload: res.data
                });
                getHotels();
            }).catch(err => {
                dispatch({
                    type: 'HOTELSAVE_FAIL',
                    payload: err,
                });
            });
        return data;

    }

    async function addHotel(formDataa) {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const formData = new FormData()
        console.log(formDataa)
        formData.append('name', formDataa.name)
        formData.append('description', formDataa.description)
        formData.append('location', formDataa.location)
        var json_arr = JSON.stringify(formDataa.rooms);
        formData.append('rooms', json_arr)
        formData.append('image', formDataa.image)
        const data = await axios.post('/api/hotel-image', formData, config)
            .then(res => {
                dispatch({
                    type: 'HOTELSAVE_SUCCESS',
                    payload: res.data
                });
                getHotels();
            }).catch(err => {
                dispatch({
                    type: 'HOTELSAVE_FAIL',
                    payload: err,
                });
            });
        return data;
    }


    function clearError() {
        dispatch({
            type: 'CLEAR_ERROR',
        })
    }

    async function removeHotel(_id) {
        const data = await axios.delete(`/api/hotel/${_id}`)
            .then(res => {
                dispatch({
                    type: 'BLOGDELETE_SUCCESS',
                    payload: _id
                });
                getHotels();
            }).catch(err => {
                dispatch({
                    type: 'BLOGDELETE_FAIL',
                    payload: err,
                });
            });
        return data;

    }

    return (<HotelContext.Provider value={{
        hotels: state,
        getHotels,
        getHotel,
        uploadFile,
        addHotel,
        saveHotel,
        removeHotel,
        getMessages,
        clearError
    }}> {children}
    </HotelContext.Provider>)
}