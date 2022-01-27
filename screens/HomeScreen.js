import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Dialog from "react-native-dialog";

import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';

import { setConnectStatus } from '../store/actions/exams';

import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('db.examsDb');

export const createTable = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS examsSqlite (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, groupp TEXT, details TEXT, status TEXT, students INTEGER, type TEXT, connection TEXT)'
            // 'DROP TABLE examsSqlite'
            // 'DELETE FROM examsSqlite'
        )
    });
}

const HomeScreen = ({ navigation }) => {
    NetInfoSubscription = null;

    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        NetInfoSubscription = NetInfo.addEventListener(state => {
            dispatch(setConnectStatus(state.isConnected));
        })
        createTable();
    }, [])

    const teacherButtonPressed = () => {
        // dispatch(getExams());
        navigation.navigate("Teacher");
    }

    const studentButtonPressed = () => {
        // dispatch(getDraftExams());
        navigation.navigate("Student");
    }

    const statsButtonPressed = () => {
        setVisible(true);
    }

    const handleCancel = () => {
        setVisible(false);
    };

    const handleEnter = () => {
        setVisible(false);
        // dispatch(getGroupExams(groupName));
        navigation.navigate("Stats", { groupName });
    };

    const renderDialog = () => {
        return (
            <Dialog.Container visible={visible}>
                <Dialog.Title>Exam details</Dialog.Title>
                <Dialog.Description>
                    Enter a group name to see exam details for that one.
                </Dialog.Description>
                <Dialog.Input placeholder={'Group name'} onChangeText={(text) => { setGroupName(text) }}></Dialog.Input>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Enter" onPress={handleEnter} />
            </Dialog.Container>
        );
    }

    return (
        <View style={styles.container}>
            {renderDialog()}

            <TouchableOpacity style={styles.buttonWrapper} onPress={teacherButtonPressed}>
                <Text style={styles.buttonText}>Teacher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonWrapper} onPress={studentButtonPressed}>
                <Text style={styles.buttonText}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonWrapper} onPress={statsButtonPressed}>
                <Text style={styles.buttonText}>Stats</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonWrapper: {
        width: 160,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#c0c0c0',
        borderWidth: 1,
        margin: 5,
    },
    buttonText: {
        fontSize: 20,
    },
});

export default HomeScreen;


