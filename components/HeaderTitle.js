import {View, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderTitle = ({theme}) => {
    return (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name="bicycle" size={28}  color={theme.text}/>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          marginLeft: 10,
          color: theme.text
        }}
      >
        Park Me Bike
      </Text>
    </View>)
};

  export default HeaderTitle;