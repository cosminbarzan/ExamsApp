import { GET_EXAMS, ADD_EXAM, GET_EXAM, GET_DRAFT_EXAMS, JOIN_EXAM, GET_GROUP_EXAMS, SET_CONNECT_STATUS, ADD_OFFLINE, SET_LOADING, ERROR } from "../actions/exams";

const initialState = {
    allExams: [],
    selectedExam: {},
    draftExams: [],
    groupExams: [],
    offlineExams: [],
    connectStatus: false,
    loading: false,
    error: {}
}

export const examsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EXAMS:
            return { ...state, allExams: action.allExams }

        case ADD_EXAM:
            return { ...state, allExams: [...state.allExams, action.addedExam] }

        case GET_EXAM:
            return { ...state, selectedExam: action.selectedExam }

        case GET_DRAFT_EXAMS:
            return { ...state, draftExams: action.draftExams }

        case JOIN_EXAM:
            let newDraftExams = state.draftExams.map(element => element.id === action.joinedExam.id ? { ...element, students: action.joinedExam.students } : element);
            return { ...state, allExams: [...state.allExams, action.joinedExam], draftExams: newDraftExams }

        case GET_GROUP_EXAMS:
            return { ...state, groupExams: action.groupExams }

        case ADD_OFFLINE:
            return { ...state, offlineExams: action.offlineExams }

        case SET_CONNECT_STATUS:
            return { ...state, connectStatus: action.connectStatus }

        case SET_LOADING:
            return { ...state, loading: action.loading }

        case ERROR:
            return { ...state, error: action.error }

        default:
            return { ...state }
    }
}
