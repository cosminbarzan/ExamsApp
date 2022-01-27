import axios from "axios";

export const GET_EXAMS = 'GET_EXAMS';
export const ADD_EXAM = 'ADD_EXAM';
export const ERROR = 'ERROR';
export const GET_EXAM = 'GET_EXAM';
export const SET_LOADING = 'SET_LOADING';
export const GET_DRAFT_EXAMS = 'GET_DRAFT_EXAMS';
export const JOIN_EXAM = 'JOIN_EXAM';
export const GET_GROUP_EXAMS = 'GET_GROUP_EXAMS';
export const SET_CONNECT_STATUS = 'SET_CONNECT_STATUS';
export const ADD_OFFLINE = 'ADD_OFFLINE';

const setIndicatorVisibility = (dispatch, value) => {
    dispatch({
        type: SET_LOADING,
        loading: value
    })
}

export const getExams = () => async (dispatch) => {
    console.log("Server call: <get all exams>");

    try {
        setIndicatorVisibility(dispatch, true);

        const response = await axios.get('http://192.168.0.189:2018/exams');

        if (response && response.status === 200) {
            dispatch({
                type: GET_EXAMS,
                allExams: response.data
            })
            setTimeout(() => {
                setIndicatorVisibility(dispatch, false);
            }, 1000);
        };
    } catch (error) {
        console.log(error);
        setIndicatorVisibility(dispatch, false);
    }
}

export const addExam = (name, group, details, type) => async (dispatch) => {
    console.log("Server call: <add exam>");

    try {
        setIndicatorVisibility(dispatch, true);

        const response = await axios.post('http://192.168.0.189:2018/exam', {
            name,
            group,
            details,
            type
        });

        if (response && response.status === 200) {
            dispatch({
                type: ADD_EXAM,
                addedExam: response.data
            })
            dispatch({ type: ERROR, error: '' })
            setTimeout(() => {
                setIndicatorVisibility(dispatch, false);
            }, 1000);
        }
    } catch (error) {
        dispatch({ type: ERROR, error: error.message });
        setIndicatorVisibility(dispatch, false);
    }
}

export const getExam = (id) => async (dispatch) => {
    console.log("Server call: <get exam>");

    try {
        setIndicatorVisibility(dispatch, true);

        const response = await axios.get(`http://192.168.0.189:2018/exam/${id}`);

        if (response && response.status === 200) {
            dispatch({
                type: GET_EXAM,
                selectedExam: response.data
            })
            setTimeout(() => {
                setIndicatorVisibility(dispatch, false);
            }, 1000);
        }
    } catch (error) {
        console.log(error);
        setIndicatorVisibility(dispatch, false);
    }
}

export const getDraftExams = () => async (dispatch) => {
    console.log("Server call: <get draft exams>");

    try {
        setIndicatorVisibility(dispatch, true);

        const response = await axios.get('http://192.168.0.189:2018/draft');

        if (response && response.status === 200) {
            dispatch({
                type: GET_DRAFT_EXAMS,
                draftExams: response.data
            })
            setTimeout(() => {
                setIndicatorVisibility(dispatch, false);
            }, 1000);
        }
    } catch (error) {
        console.log(error);
        setIndicatorVisibility(dispatch, false);
    }
}

export const joinExam = (id) => async (dispatch) => {
    console.log("Server call: <join exam>");

    try {
        setIndicatorVisibility(dispatch, true);

        const response = await axios.post('http://192.168.0.189:2018/join', {
            id
        });

        if (response && response.status === 200) {
            dispatch({
                type: JOIN_EXAM,
                joinedExam: response.data
            })
            setTimeout(() => {
                setIndicatorVisibility(dispatch, false);
            }, 1000);
        }
    } catch (error) {
        console.log(error);
        setIndicatorVisibility(dispatch, false);
    }
}

export const getGroupExams = (group) => async (dispatch) => {
    console.log("Server call: <get group exams>");

    try {
        setIndicatorVisibility(dispatch, true);

        const response = await axios.get(`http://192.168.0.189:2018/group/${group}`);

        if (response && response.status === 200) {
            dispatch({
                type: GET_GROUP_EXAMS,
                groupExams: response.data
            })
            setTimeout(() => {
                setIndicatorVisibility(dispatch, false);
            }, 1000);
        }
    } catch (error) {
        console.log(error);
        setIndicatorVisibility(dispatch, false);
    }
}

export const setConnectStatus = (status) => async (dispatch) => {
    try {
        dispatch({
            type: SET_CONNECT_STATUS,
            connectStatus: status
        })
    }
    catch (error) {
        console.log(error);
    }
}
