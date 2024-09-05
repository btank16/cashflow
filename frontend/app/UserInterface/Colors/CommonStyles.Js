import { StyleSheet } from 'react-native';

const CommonStyles = StyleSheet.create({
    logo: {
        height: 45,
        aspectRatio: 'auto',
        resizeMode: 'contain',
        maxWidth: '100%',
    },
    barButtonContainer: {
        position: 'absolute',
        left: 10,
        paddingVertical: 10,
        zIndex: 1,
        alignSelf: 'center'
    },
    logoImageBox: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    }
});

export default CommonStyles;