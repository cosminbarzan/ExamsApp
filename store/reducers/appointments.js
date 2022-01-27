const appointmentsItems = [
    {
        id: 1,
        name: 'John',
        date: '23.11.2021',
        hour: '11:00',
        description: 'medical control',
        status: 'PENDING',
    },
    {
        id: 2,
        name: 'Katie',
        date: '23.11.2021',
        hour: '17:30',
        description: 'medical control 2',
        status: 'PENDING',
    }
]

const initialState = {
    appointments: appointmentsItems,
    favoriteAppoinments: []
}

const appointmentsReducer = (state = initialState, action) => {
    // console.log("reducer", appointmentsItems);
    return state;
}

export default appointmentsReducer;
