const Content = () => {
    const appointmentsItems = useSelector(state => state.appointments.appointments);
    // console.log(appointmentsItems);

    const createTwoButtonAlert = (index) =>
        Alert.alert(
            "Delete confirmation",
            "Are you sure?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => removeLocally(index) }
            ]
        );

    const [appointment, setAppointment] = useState();

    const handleAddAppointment = () => {
        // console.log(appointment);
    }

    const d = new Date();

    const weekDay = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const day = weekDay[d.getDay()];
    const month = months[d.getMonth()];
    const date = d.getDate();
    const year = d.getFullYear();

    return (
        <View style={styles.container}>
            {/* Today's appointments */}
            <View style={styles.appointmentsWrapper}>

                <Text style={styles.currentDate}>{day + ' ' + date + ' ' + month + ' ' + year}</Text>

                <View style={styles.items}>
                    {/* This is where today's appointments will go! */}
                    {
                        appointmentsItems.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', }}>
                                    <TouchableOpacity style={{ flexGrow: 1, marginRight: 10 }} onPress={() => navigation.navigate("Update", { "item": item, "index": index })}>
                                        <Appointment text={item.name + ' - ' + item.hour} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.addWrapper} onPress={() => createTwoButtonAlert(index)}>
                                        <Text style={styles.addText}>-</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </View>
            </View>

            {/* Add an appointment */}
            <KeyboardAvoidingView style={styles.addAppointmentWrapper}>

                <TextInput style={styles.input} placeholder={'Write an appointment'} value={appointment} onChangeText={text => setAppointment(text)} />

                <TouchableOpacity onPress={() => handleAddAppointment()}>
                    <View style={styles.addWrapper}>
                        <Text style={styles.addText}>+</Text>
                    </View>
                </TouchableOpacity>
                {/* <Button title="Go to add screen" onPress={() => navigation.navigate("Update")} /> */}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd',
    },
    appointmentsWrapper: {
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    currentDate: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    items: {
        marginTop: 30,
    },
    addAppointmentWrapper: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
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
    addWrapper: {
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
});