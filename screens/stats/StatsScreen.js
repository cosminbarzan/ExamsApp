import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Exam from "../../components/Exam";

import { getGroupExams } from '../../store/actions/exams';

import ProgressBar from 'react-native-progress/Circle';

const StatsScreen = ({ route }) => {
    const dispatch = useDispatch();

    const exams = useSelector(state => state.exams.groupExams);
    const loading = useSelector(state => state.exams.loading);

    useEffect(() => {
        const { groupName } = route.params;
        dispatch(getGroupExams(groupName));
    }, [route.params?.groupName])

    const compare = (a, b) => {
        if (a.type < b.type) {
            return -1;
        }
        if (a.type > b.type) {
            return 1;
        }
        if (a.students < b.students) {
            return 1;
        }
        if (a.students > b.students) {
            return -1;
        }
        return 0;
    }

    exams.sort(compare);

    const existExams = exams.length > 0;

    if (loading) {
        return (
            <ProgressBar size={100} indeterminate={true} style={styles.progress} />
        );
    }
    return (
        <View style={styles.container}>
            {existExams ? <View style={styles.examsWrapper}>
                <ScrollView style={styles.items}>
                    {
                        exams.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', }}>
                                    <TouchableOpacity style={{ flexGrow: 1, marginRight: 10 }}>
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
                : <View style={styles.message}><Text style={styles.messageText} >No such exams are available.</Text></View>}
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
    message: {
        paddingTop: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 22,
    }
});


export default StatsScreen;
