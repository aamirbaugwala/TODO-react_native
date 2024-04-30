import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Task = (props) => {
    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>

                <Text style={styles.itemText}>{props.text}</Text>
            </View>
            <TouchableOpacity onPress={props.onDelete}>
                <FontAwesome name="trash-o" size={24} color="red" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    itemText: {
        maxWidth: '100%'
    }
});

export default Task;
