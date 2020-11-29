import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TimePicker from 'react-native-simple-time-picker';
import bg from '../images/bg.jpg';
import groupimg from '../images/groupimg.jpg';

import buildURL from '../utils/buildURL';
import axios from 'axios';
import groupbg from '../images/groupbg.jpg';
import {ScrollView} from 'react-native-gesture-handler';
import editicon from '../images/editicon.jpg';
import deleteicon from '../images/deleteicon.jpg';
import addicon from '../images/addicon.jpg';

function Group({route, navigation}) {
  const [members, setmembers] = useState([]);
  const [name, setname] = useState('');
  const [creator, setcreator] = useState('');
  const [showmembers, setshowmembers] = useState(false);
  const [showdays, setshowdays] = useState(false);
  const [token, settoken] = useState('');
  const [mode, setmode] = useState('');
  const [search, setsearch] = useState('');
  const [searchresults, setsearchresults] = useState([]);
  const [username, setusername] = useState('');
  const [fetcherror, setfetcherror] = useState(false);
  const [loading, setloading] = useState(false);
  const [scheduleid, setscheduleid] = useState('');
  const [userid, setuserid] = useState('');
  const [usertobedeleted, setusertobedeleted] = useState('');
  const [groupid, setgroupid] = useState(route.params.groupid);
  const [schedule, setschedule] = useState({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

  const [day, setday] = useState('');
  const [start, setstart] = useState('');
  const [end, setend] = useState('');
  const [timename, settimename] = useState('');
  const [timeid, settimeid] = useState('');
  const [message, setmessage] = useState('');

  const [selecthour, setselecthour] = useState(0);
  const [selectminute, setselectminute] = useState(0);
  const [selectendhour, setendselecthour] = useState(0);
  const [selectendminute, setendselectminute] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [addTimeModalVisible, setAddTimeModalVisible] = useState(false);
  const [editTimeModalVisible, setEditTimeModalVisible] = useState(false);

  const [issunday, setissunday] = useState(false);
  const [ismonday, setismonday] = useState(false);
  const [istuesday, setistuesday] = useState(false);
  const [iswednesday, setiswednesday] = useState(false);
  const [isthursday, setisthursday] = useState(false);
  const [isfriday, setisfriday] = useState(false);
  const [issaturday, setissaturday] = useState(false);

  const [addisopen, setaddisopen] = useState(false);
  const [endisopen, setendisopen] = useState(false);

  const [editisopen, seteditisopen] = useState(false);
  const [editendisopen, seteditendisopen] = useState(false);

  useEffect(() => {
    const onload = async () => {
      const getgroupschedule = async () => {
        try {
          const url = buildURL(`api/schedule/getschedulegroup`);
          const payload = {id: groupid};
          const res = await axios.post(url, payload);
          if (res.data.errors) {
            console.log(payload);
            return;
          }
          const {
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
            scheduleid,
          } = res.data;
          setscheduleid(scheduleid);

          setschedule({
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
          });
          setloading(false);
        } catch (error) {
          setfetcherror(!fetcherror);
          console.log(error);
        }
      };

      const getCreator = async () => {
        try {
          const url = buildURL('api/group/getcreator');
          const payload = {id: groupid};
          const res = await axios.post(url, payload);
          if (res.data.errors) {
            console.log(payload);
            return;
          }
          setcreator(res.data.creator);
          setmembers(res.data.members);
        } catch (error) {
          setfetcherror(!fetcherror);
          console.log(error);
        }
      };

      try {
        setgroupid(route.params.groupid);
        settoken(await AsyncStorage.getItem('token'));
        setusername(await AsyncStorage.getItem('username'));
        getgroupschedule();
        getCreator();
        setloading(false);
      } catch (error) {
        console.log(error);
      }
    };
    onload();
  }, [fetcherror]);

  async function removetime() {
    try {
      const url = buildURL('api/schedule/removetimegroup');
      const headers = {Authorization: token};
      const payload = {day, timeid, id: scheduleid};
      const res = await axios.post(url, payload, {headers});
      if (res.data.errors) {
        console.log(res.data.errors);
        return;
      }
      setschedule(res.data.schedule);
    } catch (error) {
      console.log(error);
    }
  }

  async function removeuser() {
    try {
      const url = buildURL('api/group/removeuser');
      const payload = {userid, id: groupid};
      const res = await axios.post(url, payload);
      if (res.data.errors) {
        console.log(res.data.errors);
        return;
      }
      setmembers(members.filter((member) => member.id != userid));
    } catch (error) {
      console.log(error);
    }
  }

  async function adduser(memberid, memberusername) {
    try {
      const url = buildURL('api/group/adduser');
      const payload = {
        id: groupid,
        groupname: route.params.groupname,
        userid: memberid,
      };
      const res = await axios.post(url, payload);
      if (res.data.errors) {
        console.log(res.data.errors);
        return;
      }
      setmembers([...members, {username: memberusername, id: memberid}]);
      setname('');
      setuserid('');
    } catch (error) {
      console.log(error);
    }
  }
  async function edittime() {
    try {
      const url = buildURL('api/schedule/editgroupschedule');
      const headers = {Authorization: token};
      let starttime;
      let endtime;
      if (selecthour < 10 && selectminute < 10)
        starttime = `0${selecthour}:0${selectminute}`;
      else if (selecthour > 10 && selectminute < 10)
        starttime = `${selecthour}:0${selectminute}`;
      else if (selecthour < 10 && selectminute > 10)
        starttime = `0${selecthour}:${selectminute}`;
      else if (selecthour > 10 && selectminute > 10)
        starttime = `${selecthour}:${selectminute}`;

      if (selectendhour < 10 && selectendminute < 10)
        endtime = `0${selectendhour}:0${selectendminute}`;
      else if (selectendhour > 10 && selectendminute < 10)
        endtime = `${selectendhour}:0${selectendminute}`;
      else if (selectendhour < 10 && selectendminute > 10)
        endtime = `0${selectendhour}:${selectendminute}`;
      else endtime = `${selectendhour}:${selectendminute}`;
      const payload = {
        start: starttime,
        end: endtime,
        day,
        timeid,
        name: timename,
        id: scheduleid,
      };
      const res = await axios.post(url, payload, {
        headers,
      });
      if (res.data.errors) {
        console.log(res.data.errors);
        return;
      }
      setschedule(res.data.schedule);
    } catch (error) {
      console.log(error);
    }
  }

  async function addtime() {
    try {
      const url = buildURL('api/schedule/addtimegroup');
      const headers = {Authorization: token};
      let starttime;
      let endtime;
      if (selecthour < 10 && selectminute < 10)
        starttime = `0${selecthour}:0${selectminute}`;
      else if (selecthour > 10 && selectminute < 10)
        starttime = `${selecthour}:0${selectminute}`;
      else if (selecthour < 10 && selectminute > 10)
        starttime = `0${selecthour}:${selectminute}`;
      else if (selecthour > 10 && selectminute > 10)
        starttime = `${selecthour}:${selectminute}`;

      if (selectendhour < 10 && selectendminute < 10)
        endtime = `0${selectendhour}:0${selectendminute}`;
      else if (selectendhour > 10 && selectendminute < 10)
        endtime = `${selectendhour}:0${selectendminute}`;
      else if (selectendhour < 10 && selectendminute > 10)
        endtime = `0${selectendhour}:${selectendminute}`;
      else endtime = `${selectendhour}:${selectendminute}`;
      const payload = {
        start: starttime,
        end: endtime,
        name: timename,
        day: day.toLowerCase(),
        id: groupid,
      };
      const res = await axios.post(url, payload, {headers});
      if (res.data.errors) {
        setmessage(res.data.errors);
        setTimeout(() => {
          setmessage('');
        }, 3000);
        console.log(res.data.errors);
        return;
      }

      setschedule(res.data.schedule);
      console.log(schedule);
    } catch (error) {
      console.log(error);
    }
  }

  async function searchuser() {
    try {
      const url = buildURL('api/user/search');
      const payload = {search};
      const res = await axios.post(url, payload);
      if (res.data.errors) {
        console.log(res.data.errors);
        return;
      }
      setsearchresults(res.data.users);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    !loading && (
      <SafeAreaView style={{flex: 1}}>
        <Image source={bg} style={{position: 'absolute'}} />
        <ScrollView>
          <View style={{height: '100%'}}>
            <View
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
              }}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Image
                source={groupimg}
                style={{
                  marginTop: 5,
                  borderRadius: 100,
                  height: 175,
                  width: 175,
                  borderColor: 'black',
                  borderWidth: 3,
                }}
              />
            </View>
            <View style={{position: 'absolute', width: '100%', height: '100%'}}>
              <ScrollView>
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
                          value={search}
                          onChangeText={(text) => {
                            setsearch(text);
                          }}
                          placeholder="enter a username"
                          placeholderTextColor="grey"
                          style={styles.input}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                              searchuser();
                            }}>
                            <Text>Search</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                              setsearchresults([]);
                              setModalVisible(!modalVisible);
                            }}>
                            <Text>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                        <ScrollView>
                          <View>
                            {searchresults.map((user) => (
                              <TouchableOpacity
                                key={user._id}
                                style={{padding: 10}}
                                onPress={() => {
                                  setuserid(user._id);
                                  setname(user.username);
                                  adduser(user._id, user.username);
                                  setModalVisible(!modalVisible);
                                }}>
                                <Text
                                  style={{textAlign: 'center', color: 'green'}}>
                                  {user.username}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>
                      </View>
                    </View>
                  </Modal>
                </View>
              </ScrollView>
            </View>
            <View style={{position: 'absolute', width: '100%', height: '100%'}}>
              <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={addTimeModalVisible}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <TextInput
                        value={day}
                        onChangeText={(text) => {
                          setday(text);
                        }}
                        placeholder="enter a day for this time"
                        placeholderTextColor="grey"
                        style={styles.input}
                      />
                      <TextInput
                        value={timename}
                        onChangeText={(text) => {
                          settimename(text);
                        }}
                        placeholder="enter a name for the time"
                        placeholderTextColor="grey"
                        style={styles.input}
                      />
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setaddisopen(!addisopen)}>
                        <Text>
                          start time - {selecthour}:{selectminute}
                        </Text>
                      </TouchableOpacity>
                      {!addisopen ? (
                        <TimePicker
                          selectedHours={selecthour}
                          selectedMinutes={selectminute}
                          onChange={(hours, minutes) => {
                            setselecthour(hours);
                            setselectminute(minutes);
                          }}
                        />
                      ) : null}
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setendisopen(!endisopen)}>
                        <Text>
                          endtime - {selectendhour}:{selectendminute}
                        </Text>
                      </TouchableOpacity>
                      {!endisopen ? (
                        <TimePicker
                          selectedHours={selectendhour}
                          selectedMinutes={selectendminute}
                          onChange={(hours, minutes) => {
                            setendselecthour(hours);
                            setendselectminute(minutes);
                          }}
                        />
                      ) : null}

                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => {
                            addtime();
                            setAddTimeModalVisible(!addTimeModalVisible);
                          }}>
                          <Text>add time</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() =>
                            setAddTimeModalVisible(!addTimeModalVisible)
                          }>
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
            <View style={{position: 'absolute', width: '100%', height: '100%'}}>
              <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={editTimeModalVisible}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <TextInput
                        value={timename}
                        onChangeText={(text) => {
                          settimename(text);
                        }}
                        placeholder="enter a name for the time"
                        placeholderTextColor="grey"
                        style={styles.input}
                      />
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => seteditisopen(!editisopen)}>
                        <Text>
                          {selecthour}:{selectminute}
                        </Text>
                      </TouchableOpacity>
                      {!editisopen ? (
                        <TimePicker
                          selectedHours={selecthour}
                          selectedMinutes={selectminute}
                          onChange={(hours, minutes) => {
                            setselecthour(hours);
                            setselectminute(minutes);
                          }}
                        />
                      ) : null}
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => seteditendisopen(!editendisopen)}>
                        <Text>
                          {selectendhour}:{selectendminute}
                        </Text>
                      </TouchableOpacity>
                      {!editendisopen ? (
                        <TimePicker
                          selectedHours={selectendhour}
                          selectedMinutes={selectendminute}
                          onChange={(hours, minutes) => {
                            setendselecthour(hours);
                            setendselectminute(minutes);
                          }}
                        />
                      ) : null}

                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => {
                            edittime();
                            setEditTimeModalVisible(!editTimeModalVisible);
                          }}>
                          <Text>Edit time</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() =>
                            setEditTimeModalVisible(!editTimeModalVisible)
                          }>
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
            {userid !== '' && mode === 'delete' ? (
              <View>
                {Alert.alert(
                  'Remove user',
                  `Are you sure you want to remove ${usertobedeleted} from Group: ${route.params.groupname}?`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        setuserid('');
                        setusertobedeleted('');
                        setmode('');
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        removeuser();
                        setuserid('');
                        setusertobedeleted('');
                        setmode('');
                      },
                    },
                  ],
                  {cancelable: false},
                )}
              </View>
            ) : null}
            {timeid !== '' && mode === 'delete' ? (
              <View>
                {Alert.alert(
                  'Remove time',
                  `Are you sure you want to remove this time?`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        settimeid('');
                        setmode('');
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        removetime();
                        settimeid('');
                        setmode('');
                      },
                    },
                  ],
                  {cancelable: false},
                )}
              </View>
            ) : null}
            <Text style={{textAlign: 'center', fontSize: 30}}>
              {route.params.groupname}
            </Text>
            <Text style={{textAlign: 'center', fontSize: 15, color: 'crimson'}}>
              {message}
            </Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 0,
                marginTop: 15,
                marginRight: 10,
                alignItems: 'flex-end',
                color: 'black',
                backgroundColor: '#DDDDDD',
                padding: 10,
                fontSize: 15,
                borderRadius: 30,
              }}
              onPress={() => setModalVisible(!modalVisible)}>
              <Image
                source={addicon}
                style={{width: 30, height: 30, borderRadius: 100}}
              />
            </TouchableOpacity>
            {!showmembers ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setshowmembers(!showmembers)}>
                <Text> Click to show members </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setshowmembers(!showmembers)}>
                <Text> Click to hide members </Text>
              </TouchableOpacity>
            )}
            {showmembers
              ? members.map((member) => (
                  <View
                    key={member.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      margin: 10,
                    }}>
                    <Text
                      style={{
                        marginTop: 8,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {member.username}
                    </Text>
                    {username === creator && username != member.username ? (
                      <TouchableOpacity
                        style={{marginLeft: 15}}
                        onPress={() => {
                          setuserid(member.id);
                          setusertobedeleted(member.username);
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
                    ) : null}
                  </View>
                ))
              : null}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setAddTimeModalVisible(!addTimeModalVisible)}>
              <Text> Click to add time to this group </Text>
            </TouchableOpacity>
            {!showdays ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setshowdays(!showdays)}>
                <Text> Click to show days of the week </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setshowdays(!showdays)}>
                <Text> Click to hide days of the weeks </Text>
              </TouchableOpacity>
            )}
            <ScrollView>
              {showdays ? (
                <View>
                  <View>
                    <TouchableOpacity onPress={() => setissunday(!issunday)}>
                      <Text style={{fontSize: 30, textAlign: 'center'}}>
                        Sunday
                      </Text>
                    </TouchableOpacity>
                    {issunday ? (
                      <View style={{flexDirection: 'column'}}>
                        {schedule.sunday.map((time) => (
                          <View
                            key={time._id}
                            style={{
                              padding: 10,
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                }}>
                                {time.name}
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('sunday');
                                    setEditTimeModalVisible(
                                      !editTimeModalVisible,
                                    );
                                  }}>
                                  <Image
                                    source={editicon}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 100,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('sunday');
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
                            </View>
                            <Text style={{textAlign: 'center'}}>
                              {time.start} - {time.end}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => setismonday(!ismonday)}>
                      <Text style={{fontSize: 30, textAlign: 'center'}}>
                        Monday
                      </Text>
                    </TouchableOpacity>
                    {ismonday ? (
                      <View style={{flexDirection: 'column'}}>
                        {schedule.monday.map((time) => (
                          <View
                            key={time._id}
                            style={{
                              padding: 10,
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                }}>
                                {time.name}
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('monday');
                                    setEditTimeModalVisible(
                                      !editTimeModalVisible,
                                    );
                                  }}>
                                  <Image
                                    source={editicon}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 100,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('monday');
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
                            </View>
                            <Text style={{textAlign: 'center'}}>
                              {time.start} - {time.end}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => setistuesday(!istuesday)}>
                      <Text style={{fontSize: 30, textAlign: 'center'}}>
                        Tuesday
                      </Text>
                    </TouchableOpacity>
                    {istuesday ? (
                      <View style={{flexDirection: 'column'}}>
                        {schedule.tuesday.map((time) => (
                          <View
                            key={time._id}
                            style={{
                              padding: 10,
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                }}>
                                {time.name}
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('tuesday');
                                    setEditTimeModalVisible(
                                      !editTimeModalVisible,
                                    );
                                  }}>
                                  <Image
                                    source={editicon}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 100,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('tuesday');
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
                            </View>
                            <Text style={{textAlign: 'center'}}>
                              {time.start} - {time.end}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => setiswednesday(!iswednesday)}>
                      <Text style={{fontSize: 30, textAlign: 'center'}}>
                        Wednesday
                      </Text>
                    </TouchableOpacity>
                    {iswednesday ? (
                      <View style={{flexDirection: 'column'}}>
                        {schedule.wednesday.map((time) => (
                          <View
                            key={time._id}
                            style={{
                              padding: 10,
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                }}>
                                {time.name}
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('wednesday');
                                    setEditTimeModalVisible(
                                      !editTimeModalVisible,
                                    );
                                  }}>
                                  <Image
                                    source={editicon}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 100,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('wednesday');
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
                            </View>
                            <Text style={{textAlign: 'center'}}>
                              {time.start} - {time.end}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => setisthursday(!isthursday)}>
                      <Text style={{fontSize: 30, textAlign: 'center'}}>
                        Thursday
                      </Text>
                    </TouchableOpacity>
                    {isthursday ? (
                      <View style={{flexDirection: 'column'}}>
                        {schedule.thursday.map((time) => (
                          <View
                            key={time._id}
                            style={{
                              padding: 10,
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                }}>
                                {time.name}
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('thursday');
                                    setEditTimeModalVisible(
                                      !editTimeModalVisible,
                                    );
                                  }}>
                                  <Image
                                    source={editicon}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 100,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('thursday');
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
                            </View>
                            <Text style={{textAlign: 'center'}}>
                              {time.start} - {time.end}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => setisfriday(!isfriday)}>
                      <Text style={{fontSize: 30, textAlign: 'center'}}>
                        Friday
                      </Text>
                    </TouchableOpacity>
                    {isfriday ? (
                      <View style={{flexDirection: 'column'}}>
                        {schedule.friday.map((time) => (
                          <View
                            key={time._id}
                            style={{
                              padding: 10,
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                }}>
                                {time.name}
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('friday');
                                    setEditTimeModalVisible(
                                      !editTimeModalVisible,
                                    );
                                  }}>
                                  <Image
                                    source={editicon}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 100,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('friday');
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
                            </View>
                            <Text style={{textAlign: 'center'}}>
                              {time.start} - {time.end}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => setissaturday(!issaturday)}>
                      <Text style={{fontSize: 30, textAlign: 'center'}}>
                        Saturday
                      </Text>
                    </TouchableOpacity>
                    {issaturday ? (
                      <View style={{flexDirection: 'column'}}>
                        {schedule.saturday.map((time) => (
                          <View
                            key={time._id}
                            style={{
                              padding: 10,
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                }}>
                                {time.name}
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('saturday');
                                    setEditTimeModalVisible(
                                      !editTimeModalVisible,
                                    );
                                  }}>
                                  <Image
                                    source={editicon}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 100,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{marginLeft: 15}}
                                  onPress={() => {
                                    settimeid(time._id);
                                    setday('saturday');
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
                            </View>
                            <Text style={{textAlign: 'center'}}>
                              {time.start} - {time.end}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  );
}
const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    marginRight: 10,
    alignItems: 'center',
    color: 'black',
    backgroundColor: '#DDDDDD',
    padding: 10,
    fontSize: 15,
    borderRadius: 10,
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
});
export default Group;
