export default (state, action) => {
    switch (action.type) {
        case 'HOTELUPDATE_SUCCESS':
        case 'HOTELSAVE_SUCCESS':    
        case 'HOTEL_LOADED':
        case 'MESSAGES_LOADED':
            return {
                ...state,
                blog: action.payload,
                error: null
            };
        case 'HOTELS_LOADED':
        case 'HOTEL_LOADED':
            return {
                ...state,
                blogs: action.payload,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state
    }
}