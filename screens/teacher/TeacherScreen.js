import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Exam from "../../components/Exam";
import { getExams, setConnectStatus } from '../../store/actions/exams';

import { useEffect, useState } from 'react';

import ProgressBar from 'react-native-progress/Circle';

import { db } from '../HomeScreen';
import { conn_status } from '../../utils/ConnectionStatus';

import { SET_LOADING, GET_EXAMS } from '../../store/actions/exams';

import axios from 'axios';

const TeacherScreen = ({ navigation }) => {

    const dispatch = useDispatch();

    const exams = useSelector(state => state.exams.allExams);
    const loading = useSelector(state => state.exams.loading);
    const connectStatus = useSelector(state => state.exams.connectStatus);

    const [nbOfLocalExams, setNbOfLocalExams] = useState(0);
    const [localExams, setLocalExams] = useState([]);
    const [retryPressed, setRetryPressed] = useState(false);

    const displaySpinner = (value) => {
        dispatch({
            type: SET_LOADING,
            loading: value
        })
    }

    const getNbOfLocalExams = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('SELECT COUNT(*) as nb FROM examsSqlite;', null,
                    (txObj, { rows: { _array } }) => {
                        resolve(_array[0].nb);
                    },
                    (txObj, error) => {
                        // console.log(error.message);
                        // displayError('Error on get nb of locsl exams ');
                        reject(error);
                    }
                )
            })
        })
    }

    const addLocally = ({ id, name, group, details, status, students, type }, connection) => {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO examsSqlite (id, name, groupp, details, status, students, type, connection) values (?, ?, ?, ?, ?, ?, ?, ?)', [id, name, group, details, status, students, type, connection],
                (txObj, resultSet) => {
                    // setFinishOperation(true);
                },
                (txObj, error) => {
                    console.log(error.message);
                    // displayError('Error on add locally');
                }
            )
        })
    };

    const getLocalExams = () => {
        displaySpinner(true);

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM examsSqlite WHERE connection=?', [conn_status.ONLINE],
                    (txObj, { rows: { _array } }) => {
                        // setLocalExams(_array);
                        const newArray = _array.map(elem => {
                            return {
                                connection: elem.connection,
                                details: elem.details,
                                group: elem.groupp,
                                id: elem.id,
                                name: elem.name,
                                status: elem.status,
                                students: elem.students,
                                type: elem.type
                            }
                        })
                        resolve(newArray);
                    },
                    (txObj, error) => {
                        console.log(error.message);
                        // displayError('Error on get local exams ');
                        reject(error);
                    }
                )
            })
        })
    }

    const getServerExams = async () => {
        console.log("Server call: <get all exams>");
        try {
            displaySpinner(true);

            const response = await axios.get('http://192.168.0.189:2018/exams');

            if (response && response.status === 200) {
                // exams = response.data;
                return response.data;
            };
        }
        catch (error) {
            return error;
        }
    }

    const updateLocalExams = (exams) => {
        exams.forEach(exam => {
            addLocally(exam, conn_status.ONLINE);
        })

        // setLocalExams(exams);
    }



    useEffect(() => {
        getNbOfLocalExams()
            .then(nb => {
                setNbOfLocalExams(nb);
                console.log(nb);

                if (connectStatus) {
                    if (nb === 0) {
                        // dispatch(getExams());
                        getServerExams()
                            .then(exams => {
                                console.log(exams);
                                setNbOfLocalExams(exams.length);
                                dispatch({
                                    type: GET_EXAMS,
                                    allExams: exams
                                })
                                updateLocalExams(exams);
                            })
                            .catch(error => {
                                console.log(error);
                            })
                            .finally(() => {
                                displaySpinner(false);
                            })
                    }
                    else {
                        getLocalExams()
                            .then(exams => {
                                console.log(exams);
                                dispatch({
                                    type: GET_EXAMS,
                                    allExams: exams
                                })
                            })
                            .catch(error => {
                                console.log(error);
                            })
                            .finally(() => {
                                displaySpinner(false);
                            });
                    }
                }
                else {
                    if (nb !== 0) {
                        getLocalExams()
                            .then(exams => {
                                dispatch({
                                    type: GET_EXAMS,
                                    allExams: exams
                                })
                            })
                            .catch(error => {
                                console.log(error);
                            })
                            .finally(() => {
                                displaySpinner(false);
                            });
                    }
                }
            });
    }, [connectStatus])

    const itemPressed = (id) => {
        // dispatch(getExam(id));
        navigation.navigate("ExamDetails", { id });
    }

    const handleRetryPressed = () => {
        if (connectStatus) {
            // dispatch(getExams());
            getServerExams();
            setNbOfLocalExams(exams.length);
            updateLocalExams();
        }
    }

    if (loading) {
        return (
            <ProgressBar size={100} indeterminate={true} style={styles.progress} />
        );
    }
    if (!loading && nbOfLocalExams === 0) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.retryButton} onPress={() => { setRetryPressed(true); handleRetryPressed(); }}>
                    <Text style={styles.addText}>Retry connection</Text>
                </TouchableOpacity>
            </View >
        );
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddExam")}>
                <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
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
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 60,
        borderColor: '#c0c0c0',
        borderWidth: 1,
        width: 250,
    },
    addButton: {
        alignSelf: 'center',
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#c0c0c0',
        borderWidth: 1,
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
    addText: {
        fontSize: 30,
    },
    progress: {
        marginTop: 60,
        alignItems: 'center',
    },
    retryButton: {
        alignSelf: 'center',
        width: 250,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#c0c0c0',
        borderWidth: 1,
    }
});

export default TeacherScreen;
