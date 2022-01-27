import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Exam from "../../components/Exam";

import { joinExam } from "../../store/actions/exams";
import { getDraftExams } from '../../store/actions/exams';

import ProgressBar from 'react-native-progress/Circle';

const StudentScreen = () => {
    const dispatch = useDispatch();

    const exams = useSelector(state => state.exams.draftExams);
    const loading = useSelector(state => state.exams.loading);
    const connectStatus = useSelector(state => state.exams.connectStatus);

    useEffect(() => {
        dispatch(getDraftExams());
    }, [])

    const itemPressed = (id) => {
        dispatch(joinExam(id));
    }

    if (!connectStatus) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addText}>Retry connection</Text>
                </TouchableOpacity>
            </View>
        );
    }
    if (loading) {
        return (
            <ProgressBar size={100} indeterminate={true} style={styles.progress} />
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.examsWrapper}>
                <ScrollView style={styles.items}>
                    {
                        exams.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', }}>
                                    <TouchableOpacity style={{ flexGrow: 1, marginRight: 10 }} onPress={() => { itemPressed(item.id) }}>
                                        <Exam id={item.id} name={item.name} group={item.group} type={item.type} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.removeButton} onPress={() => createTwoButtonAlert(index)}>
                                        <Text style={styles.addText}>-</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd',
    },
    examsWrapper: {
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    items: {
        marginBottom: 60,
    },
    removeButton: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#c0c0c0',
        borderWidth: 1,
    },
});

export default StudentScreen;
