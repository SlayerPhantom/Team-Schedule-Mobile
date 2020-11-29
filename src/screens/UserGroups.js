import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableOpacityBase,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import buildURL from '../utils/buildURL';
import axios from 'axios';
import bg from '../images/bg.jpg';
import groupicon from '../images/groupicon.jpg';
import addicon from '../images/addicon.jpg';
import deleteicon from '../images/deleteicon.jpg';

function UserGroups({navigation}) {
  const [fetcherror, setfetcherror] = useState(false);
  const [token, settoken] = useState('');
  const [username, setusername] = useState('');
  const [groups, setgroups] = useState([]);
  const [groupid, setgroupid] = useState('');
  const [groupname, setgroupname] = useState('');
  const [loading, setloading] = useState(true);
  const [mode, setmode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const onload = async () => {
      const getusergroups = async () => {
        try {
          const headers = {Authorization: token};
          const url = buildURL('api/user/getgroups');
          const res = await axios.get(url, {headers});
          if (res.data.errors) {
            console.log(res.data.errors);
            return;
          }
          setgroups(res.data.groups);
        } catch (error) {
          setfetcherror(!fetcherror);
          console.log(error);
        }
      };

      try {
        settoken(await AsyncStorage.getItem('token'));
        setusername(await AsyncStorage.getItem('username'));
        getusergroups();
        console.log(groups);
        setloading(false);
      } catch (error) {
        setfetcherror(!fetcherror);
        console.log(error);
      }
    };
    onload();
  }, [fetcherror]);

  async function addgroup() {
    try {
      const url = buildURL('api/group/creategroup');
      const headers = {Authorization: token};
      const payload = {name: groupname};
      const res = await axios.post(url, payload, {headers});
      if (res.data.errors) {
        const {errors} = res.data;
        console.log(errors);
        return;
      }
      const {id, scheduleid, members} = res.data;
      setgroups([
        ...groups,
        {id: id, name: groupname, scheduleid, creator: username, members},
      ]);
    } catch (error) {
      console.log(error);
    }
  }
  async function removegroup() {
    try {
      const url = buildURL('api/group/removegroup');
      const payload = {id: groupid};
      console.log(payload);
      const res = await axios.post(url, payload);
      if (res.data.errors) {
        console.log(res.data.errors);
        return;
      }
      setgroups(groups.filter((group) => group.id != groupid));
      setgroupid('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    !loading && (
      <ScrollView>
        <Image source={bg} style={{position: 'absolute'}} />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Image
            source={groupicon}
            style={{
              marginTop: 10,
              borderRadius: 100,
              height: 200,
              width: 200,
              borderColor: 'black',
              borderWidth: 3,
            }}
          />
        </View>
        <View>
          <Text style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>
            Groups
          </Text>
          {groupid !== '' && mode === 'delete' ? (
            <View>
              {Alert.alert(
                'Remove Group?',
                'Are you sure you want to remove this Group',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      setgroupid('');
                    },
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      removegroup();
                      setgroupid('');
                    },
                  },
                ],
                {cancelable: false},
              )}
            </View>
          ) : null}
          <View style={{position: 'absolute', width: '100%', height: '100%'}}>
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TextInput
                      value={groupname}
                      onChangeText={(text) => {
                        setgroupname(text);
                      }}
                      placeholder="enter group name"
                      placeholderTextColor="grey"
                      style={styles.input}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Button
                        title="add"
                        onPress={() => {
                          addgroup();
                          setModalVisible(!modalVisible);
                        }}
                      />
                      <Button
                        title="cancel"
                        onPress={() => {
                          setModalVisible(!modalVisible);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
          <View style={{position: 'absolute', right: 0, top: 0}}>
            <TouchableOpacity
              style={styles.opacitybutton}
              onPress={() => setModalVisible(!modalVisible)}>
              <Image
                source={addicon}
                style={{width: 30, height: 30, borderRadius: 100}}
              />
              {/* <Text>Add Group</Text> */}
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 20}}>
            {groups.map((group) => (
              <View key={group.id} style={{flexDirection: 'row', padding: 20}}>
                <TouchableOpacity
                  style={{
                    fontSize: 15,
                    marginTop: 15,
                    marginRight: 10,
                    alignItems: 'center',
                    color: 'blue',
                    backgroundColor: 'white',
                    borderRadius: 5,
                    padding: 10,
                    fontSize: 15,
                    width: 150,
                  }}
                  onPress={() =>
                    navigation.navigate('Group', {
                      groupid: group.id,
                      groupname: group.name,
                    })
                  }>
                  <Text style={{fontSize: 20}}>{group.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removebutton}
                  onPress={() => {
                    setgroupid(group.id);
                    setmode('delete');
                  }}>
                  <Image
                    source={deleteicon}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
    borderRadius: 10,
  },
  inputView: {
    flexDirection: 'row',
  },
  time: {
    textAlign: 'center',
    fontSize: 20,
  },
  day: {
    fontSize: 20,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },

  name: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    paddingTop: 10,
  },
  timeview: {
    textAlign: 'center',
    fontSize: 20,
    flexDirection: 'column',
  },
  editname: {
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    paddingTop: 10,
  },
  edittimeview: {
    color: 'green',
    textAlign: 'center',
    fontSize: 20,
    flexDirection: 'column',
  },
  deletename: {
    color: 'crimson',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    paddingTop: 10,
  },
  deletetimeview: {
    color: 'crimson',
    textAlign: 'center',
    fontSize: 20,
    flexDirection: 'column',
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  opacitybutton: {
    marginTop: 15,
    marginRight: 10,
    alignItems: 'center',
    color: 'black',
    backgroundColor: '#DDDDDD',
    padding: 10,
    fontSize: 15,
    borderRadius: 30,
  },
  removebutton: {
    marginTop: 15,
    marginRight: 10,
    alignItems: 'center',
    color: 'black',
    backgroundColor: 'crimson',
    padding: 10,
    fontSize: 15,
  },
});

export default UserGroups;
