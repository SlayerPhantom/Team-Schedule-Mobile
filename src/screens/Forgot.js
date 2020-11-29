import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';
import buildURL from '../utils/buildURL';
import bg from '../images/bg.jpg';
import forgotpasswordimg from '../images/forgotpasswordimg.jpg';

function Forgot({navigation}) {
  const [email, setEmail] = useState('');
  const [message, setmessage] = useState('');

  async function sendemail() {
    try {
      const payload = {email};
      const url = buildURL(`api/miscellaneous/forgotpassword`);
      const res = await axios.post(url, payload);
      if (res.data.errors) {
        setmessage(res.data.errors);
        console.log(res.data.errors);
        return;
      }
      setmessage('email has been sent');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <Image source={bg} style={{position: 'absolute'}} />
      <Image
        source={forgotpasswordimg}
        style={{
          position: 'absolute',
          top: 40,
          borderRadius: 100,
          height: 200,
          width: 200,
          borderColor: 'black',
          borderWidth: 3,
        }}
      />
      <Text>{message}</Text>

      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
        placeholder={'Email address'}
        placeholderTextColor="grey"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={sendemail}>
        <Text style={{fontSize: 20, color: 'white'}}>Send email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: '80%',
    height: 44,
    padding: 10,
    borderWidth: 3,
    borderBottomColor: 'black',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  inputView: {
    flexDirection: 'row',
  },
  button: {
    width: 300,
    height: 50,
    marginTop: 15,
    marginRight: 10,
    alignItems: 'center',
    color: 'black',
    backgroundColor: '#00001a',
    padding: 10,
    fontSize: 15,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default Forgot;
