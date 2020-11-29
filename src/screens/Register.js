import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Button, Image} from 'react-native';

import axios from 'axios';
import buildURL from '../utils/buildURL';
import loginbg from '../images/loginbg.jpg';
import registericon from '../images/register.jpg';
import bg from '../images/bg.jpg';
import {TouchableOpacity} from 'react-native-gesture-handler';

function Register({navigation}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setmessage] = useState('');

  async function register() {
    try {
      const payload = {
        username,
        email,
        fname,
        lname,
        password,
        confirmPassword,
      };
      const url = buildURL('api/register');
      const res = await axios.post(url, payload);
      if (res.data.errors) {
        setmessage(res.data.errors);
        return;
      }
      setmessage(res.data.message);
    } catch (error) {
      setmessage(error);
    }
  }
  return (
    <View style={styles.container}>
      <Image source={bg} style={{position: 'absolute'}} />
      <Image
        source={registericon}
        style={{
          marginTop: -50,
          borderRadius: 100,
          height: 200,
          width: 200,
          borderColor: 'black',
          borderWidth: 3,
        }}
      />
      <Text style={{color: 'crimson', fontSize: 15}}>{message}</Text>
      <TextInput
        value={username}
        onChangeText={(text) => {
          setUsername(text);
        }}
        placeholder={'Username'}
        placeholderTextColor="grey"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
        placeholder={'Email address'}
        placeholderTextColor="grey"
        style={styles.input}
      />
      <TextInput
        value={fname}
        onChangeText={(text) => {
          setFname(text);
        }}
        placeholder={'First name'}
        placeholderTextColor="grey"
        style={styles.input}
      />
      <TextInput
        value={lname}
        onChangeText={(text) => {
          setLname(text);
        }}
        placeholder={'Last Name'}
        placeholderTextColor="grey"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        placeholder={'password'}
        placeholderTextColor="grey"
        secureTextEntry={true}
        style={styles.input}
      />
      <TextInput
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
        }}
        placeholder={'confirm password'}
        placeholderTextColor="grey"
        secureTextEntry={true}
        style={styles.input}
      />

      <TouchableOpacity onPress={register} style={styles.opacitybutton}>
        <Text style={{fontSize: 20, color: 'white'}}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.opacitybutton}>
        <Text style={{fontSize: 20, color: 'white'}}>Back to Login</Text>
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
  opacitybutton: {
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

export default Register;
