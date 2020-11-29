import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  TouchableOpacityBase,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import buildURL from '../utils/buildURL';
import loginbg from '../images/loginbg.jpg';
import user from '../images/user.jpg';
import bg from '../images/bg.jpg';

function Login({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setmessage] = useState('');

  async function login() {
    try {
      const payload = {username, password};
      const url = buildURL('api/login');
      const res = await axios.post(url, payload);
      if (res.data.errors) {
        setmessage(res.data.errors);
        setTimeout(() => setmessage(''), 5000);
        return;
      }
      const {token, scheduleid} = res.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('scheduleid', scheduleid);
      await AsyncStorage.setItem('username', username);

      navigation.replace('SchedulerApp', {token: token, username: username});
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={bg} style={{position: 'absolute'}} />
      <Text
        style={{
          position: 'absolute',
          color: 'white',
          fontSize: 30,
          top: 20,
          fontWeight: 'bold',
        }}>
        Scheduler App
      </Text>
      <Image
        source={user}
        style={{
          marginTop: -50,
          borderRadius: 100,
          height: 200,
          width: 200,
          borderColor: 'black',
          borderWidth: 3,
        }}
      />
      <Text style={{color: 'white', fontSize: 30}}>Login</Text>
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
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        placeholder={'Password'}
        placeholderTextColor="grey"
        secureTextEntry={true}
        style={styles.input}
      />
      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={{fontSize: 20, color: 'white'}}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.button}>
        <Text style={{fontSize: 20, color: 'white'}}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Forgot Password')}
        style={styles.button}>
        <Text style={{fontSize: 20, color: 'white'}}>
          Forgot your password?
        </Text>
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

export default Login;
