import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { addExam } from "../../store/actions/exams";

import { useDispatch, useSelector } from "react-redux";

import { conn_status } from '../../utils/ConnectionStatus';

import ProgressBar from 'react-native-progress/Circle';
import Dialog from "react-native-dialog";

import axios from 'axios';

import { SET_LOADING, ADD_EXAM, ADD_OFFLINE } from "../../store/actions/exams";


const AddExam = () => {
    const [name, setName] = useState();
    const [group, setGroup] = useState();
    const [details, setDetails] = useState();
    const [type, setType] = useState();

    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [offlineExams, setOfflineExams] = useState([]);

    const displaySpinner = (value) => {
        dispatch({
            type: SET_LOADING,
            loading: value
        })
    }

    const dispatch = useDispatch();


    const error = useSelector(state => state.exams.error)
    const loading = useSelector(state => state.exams.loading);
    const connectStatus = useSelector(state => state.exams.connectStatus);

    const handleOk = () => {
        setVisible(false);
    };

    const [isSavePress, setIsSavePress] = useState(false);


    useEffect(() => {
        // ws.current = new WebSocket("wss://ws.kraken.com/");
        const ws = new WebSocket("ws://192.168.0.189:2018");

        ws.onopen = () => console.log("ws opened");
        ws.onclose = () => console.log("ws closed");

        ws.onmessage = e => {
            const message = JSON.parse(e.data);
            console.log("e", message);
            setDialogMessage(message.group);
            setVisible(true);
        };

        return () => {
            ws.close();
        }
    }, [isSavePress]);


    // useEffect(() => {
    //     setDialogMessage(error);
    //     setVisible(true);
    //     console.log(error);
    // }, [error])

    const addLocally = (id, name, group, details, status, students, type, connection) => {
        if (id === null) {
            db.transaction(tx => {
                tx.executeSql('INSERT INTO examsSqlite (name, groupp, details, status, students, type, connection) values (?, ?, ?, ?, ?, ?, ?)', [name, group, details, status, students, type, connection],
                    (txObj, resultSet) => {
                        // setFinishOperation(true);
                        dispatch({
                            type: ADD_OFFLINE,
                            offlineExams: value
                        })
                    },
                    (txObj, error) => {
                        console.log(error.message);
                        // displayError('Error on add locally');
                    }
                )
            })
        }
        else {
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
        }
    };

    const addExamOnServer = async (name, group, details, type) => {
        console.log("Server call: <add exam>");

        try {
            displaySpinner(true);

            const response = await axios.post('http://192.168.0.189:2018/exam', {
                name,
                group,
                details,
                type
            });

            if (response && response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return error;
        }
    }

    const genericAddExam = (name, group, details, type) => {
        if (connectStatus) {
            addExamOnServer(name, group, details, type)
                .then(exam => {
                    dispatch({
                        type: ADD_EXAM,
                        addedExam: exam
                    })
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    displaySpinner(false);
                })
        }
        else {
            addLocally(null, name, group, details, 'draft', 0, type, conn_status.OFFLINE);
        }
    }

    const onSavePress = () => {
        setIsSavePress(true);
        // dispatch(addExam(name, group, details, type));
        genericAddExam(name, group, details, type);
    };

    const renderDialog = () => {
        return (
            <Dialog.Container visible={visible}>
                <Dialog.Title>Add exam details</Dialog.Title>
                <Dialog.Description>
                    {dialogMessage}
                </Dialog.Description>
                <Dialog.Button label="Ok" onPress={handleOk} />
            </Dialog.Container>
        );
    }

    if (loading) {
        return (
            <ProgressBar size={100} indeterminate={true} style={styles.progress} />
        );
    }
    return (
        <View style={styles.inputsContainer}>
            {renderDialog()}
            <TextInput style={styles.input} placeholder={'Name'} onChangeText={(text) => { setName(text) }} />
            <TextInput style={styles.input} placeholder={'Group'} onChangeText={(text) => { setGroup(text) }} />
            <TextInput style={styles.input} placeholder={'Details'} onChangeText={(text) => { setDetails(text) }} />
            <TextInput style={styles.input} placeholder={'Type'} onChangeText={(text) => { setType(text) }} />

            {/* disabled={!name || !group || !details || !type} */}
            <TouchableOpacity style={styles.saveButton} onPress={onSavePress} >
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
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

export default AddExam;
