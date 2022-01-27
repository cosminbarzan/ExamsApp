import { StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getExam } from "../../store/actions/exams";

import ProgressBar from 'react-native-progress/Circle';
import { useEffect } from "react";

const ExamDetails = ({ route }) => {
    const dispatch = useDispatch();

    const exam = useSelector(state => state.exams.selectedExam);
    const loading = useSelector(state => state.exams.loading);

    useEffect(() => {
        const { id } = route.params;
        dispatch(getExam(id));
    }, [route.params?.id])

    if (loading) {
        return (
            <ProgressBar size={100} indeterminate={true} style={styles.progress} />
        );
    }
    return (
        <View style={styles.inputsContainer}>
            <TextInput style={styles.input} value={exam.name} editable={false} />
            <TextInput style={styles.input} defaultValue={exam.group} editable={false} />
            <TextInput style={styles.input} defaultValue={exam.details} editable={false} />
            <TextInput style={styles.input} value={exam.type} editable={false} />
            <TextInput style={styles.input} value={exam.status} editable={false} />
            <TextInput style={styles.input} value={JSON.stringify(exam.students)} editable={false} />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 60,
        borderColor: '#c0c0c0',
        borderWidth: 1,
        width: 250,
        marginBottom: 5,
    },
    saveButton: {
        marginTop: 15,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 60,
        backgroundColor: '#55bcf6',
        borderColor: '#c0c0c0',
        borderWidth: 1,
        width: 250,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveText: {
        fontSize: 16,
    },
    inputsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 80,
    }
});

export default ExamDetails;
