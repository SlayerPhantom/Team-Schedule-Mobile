import React, {useState, useEffect, Component} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import buildURL from '../utils/buildURL';
import bg from '../images/bg.jpg';
import TimePicker from 'react-native-simple-time-picker';
import addicon from '../images/addicon.jpg';
import homeusericon from '../images/homeusericon.jpg';
import editicon from '../images/editicon.jpg';
import deleteicon from '../images/deleteicon.jpg';

function Home({navigation, route}) {
  const [message, setmessage] = useState('');
  const [token, settoken] = useState('');
  const [username, setusername] = useState('');
  const [scheduleid, setscheduleid] = useState('');
  const [groups, setgroups] = useState([]);

  const [selecthour, setselecthour] = useState(0);
  const [selectminute, setselectminute] = useState(0);
  const [selectendhour, setendselecthour] = useState(0);
  const [selectendminute, setendselectminute] = useState(0);

  const [fetcherror, setfetcherror] = useState(false);
  const [loading, setloading] = useState(true);
  const [mode, setmode] = useState('');
  const [schedulemode, setschedulemode] = useState('user');

  const [timename, settimename] = useState('');
  const [start, setstart] = useState('');
  const [end, setend] = useState('');
  const [day, setday] = useState('');
  const [timeid, settimeid] = useState('');

  const [groupname, setgroupname] = useState('');

  const [issunday, setissunday] = useState(false);
  const [ismonday, setismonday] = useState(false);
  const [istuesday, setistuesday] = useState(false);
  const [iswednesday, setiswednesday] = useState(false);
  const [isthursday, setisthursday] = useState(false);
  const [isfriday, setisfriday] = useState(false);
  const [issaturday, setissaturday] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [addisopen, setaddisopen] = useState(false);
  const [endisopen, setendisopen] = useState(false);

  const [editisopen, seteditisopen] = useState(false);
  const [editendisopen, seteditendisopen] = useState(false);

  const togglesunday = () => {
    setissunday(!issunday);
  };
  const togglemonday = () => {
    setismonday(!ismonday);
  };
  const toggletuesday = () => {
    setistuesday(!istuesday);
  };
  const togglewednesday = () => {
    setiswednesday(!iswednesday);
  };
  const togglethursday = () => {
    setisthursday(!isthursday);
  };
  const togglefriday = () => {
    setisfriday(!isfriday);
  };
  const togglesaturday = () => {
    setissaturday(!issaturday);
  };
  const [schedule, setschedule] = useState({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

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

      const getuserschedule = async () => {
        try {
          const url = buildURL('api/schedule/getscheduleuser');
          const headers = {Authorization: token};
          const res = await axios.get(url, {headers});
          if (res.data.errors) {
            setmessage(res.data.errors);
            setTimeout(() => setmessage(''), 3000);
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
          } = res.data;
          setschedule({
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
          });
        } catch (error) {
          setfetcherror(!fetcherror);
          console.log(error);
        }
      };

      try {
        settoken(await AsyncStorage.getItem('token'));
        setusername(await AsyncStorage.getItem('username'));
        setscheduleid(await AsyncStorage.getItem('scheduleid'));
        getusergroups();
        getuserschedule();
        setloading(false);
      } catch (error) {
        setfetcherror(!fetcherror);
        console.log(error);
      }
    };
    onload();
  }, [fetcherror]);

  const toggleschedulemode = () => {
    const getuserschedule = async () => {
      try {
        const url = buildURL('api/schedule/getscheduleuser');
        const headers = {Authorization: token};
        const res = await axios.get(url, {headers});
        if (res.data.errors) {
          setmessage(res.data.errors);
          setTimeout(() => setmessage(''), 3000);
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
        } = res.data;
        setschedule({
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (schedulemode === 'user') {
      mergeschedules();
      setschedulemode('all');
    } else {
      getuserschedule();
      setschedulemode('user');
    }
  };

  async function mergeschedules() {
    try {
      const url = buildURL('api/schedule/getuserassociatedschedule');
      const headers = {Authorization: token};
      const res = await axios.get(url, {headers});

      if (res.data.errors) {
        setmessage(res.data.errors);
        setTimeout(() => setmessage(''), 3000);
        return;
      }
      setschedule(res.data.schedule);
    } catch (error) {
      console.log(error);
    }
  }

  async function addtime() {
    try {
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
        name: timename,
        end: endtime,
        start: starttime,
        day: day.toLowerCase(),
      };

      const headers = {Authorization: token};
      const url = buildURL('api/schedule/addtimeuser');
      const res = await axios.post(url, payload, {headers});
      if (res.data.errors) {
        setmessage(res.data.errors);
        setTimeout(() => setmessage(''), 3000);
        return;
      }
      setschedule(res.data.schedule);
    } catch (error) {
      console.log(error);
    }
  }

  async function removetime() {
    try {
      const url = buildURL('api/schedule/removetimeuser');
      const headers = {Authorization: token};
      const payload = {day, timeid};
      const res = await axios.post(url, payload, {headers});
      if (res.data.errors) {
        setmessage(res.data.errors);
        setTimeout(() => setmessage(''), 3000);
        return;
      }
      setschedule(res.data.schedule);
    } catch (error) {}
  }

  async function edittime() {
    try {
      const url = buildURL('api/schedule/edituserschedule');
      let starttime;
      let endtime;
      setday(day.toLowerCase());
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
        id: scheduleid,
        start: starttime,
        end: endtime,
        timeid,
        name: timename,
        day,
      };
      console.log(payload);
      const headers = {Authorization: token};
      const res = await axios.post(url, payload, {headers});
      if (res.data.errors) {
        setmessage(res.data.errors);
        setTimeout(() => setmessage(''), 3000);
        return;
      }
      setschedule(res.data.schedule);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    !loading && (
      <SafeAreaView style={{flex: 1}}>
        <Image source={bg} style={{position: 'absolute'}} />
        <ScrollView>
          <Text
            style={{
              fontSize: 25,
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            {username} Schedule
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 10,
                right: 5,
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 5,
                borderWidth: 3,
                borderColor: 1,
              }}
              onPress={() => navigation.replace('Login')}>
              <Text style={{fontSize: 15}}>Logout</Text>
            </TouchableOpacity>
            <Image
              source={homeusericon}
              style={{
                marginTop: 20,
                borderRadius: 100,
                height: 175,
                width: 175,
                borderColor: 'black',
                borderWidth: 3,
              }}
            />
          </View>
          <View>
            <View style={{marginLeft: 80, marginTop: 30}}>
              <Text style={{marginLeft: 90, color: 'crimson'}}>{message}</Text>
            </View>
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
                        value={timename}
                        onChangeText={(text) => {
                          settimename(text);
                        }}
                        placeholder="enter the name for the time"
                        placeholderTextColor="grey"
                        style={styles.input}
                      />
                      {!addisopen ? (
                        <TimePicker
                          selectedHours={selecthour}
                          selectedMinutes={selectminute}
                          onChange={(hours, minutes) => {
                            setselecthour(hours);
                            setselectminute(minutes);
                          }}
                        />
                      ) : (
                        <Text>
                          {selecthour}:{selectminute}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={styles.opacitybutton}
                        onPress={() => setaddisopen(!addisopen)}>
                        {addisopen ? (
                          <Text>Select start time</Text>
                        ) : (
                          <Text>close start time selector</Text>
                        )}
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
                      ) : (
                        <Text>
                          {selectendhour}:{selectendminute}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={styles.opacitybutton}
                        onPress={() => setendisopen(!endisopen)}>
                        {endisopen ? (
                          <Text>Select end time</Text>
                        ) : (
                          <Text>close end time selector</Text>
                        )}
                      </TouchableOpacity>

                      <TextInput
                        value={day}
                        onChangeText={(text) => {
                          setday(text);
                        }}
                        placeholder="day of week"
                        placeholderTextColor="grey"
                        style={styles.input}
                      />

                      <Button
                        title="add"
                        onPress={() => {
                          addtime();
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
                </Modal>
              </View>
            </View>
            <View style={{position: 'absolute', width: '100%', height: '100%'}}>
              <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={editModalVisible}
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
                        placeholder="enter the name for the time"
                        placeholderTextColor="grey"
                        style={styles.input}
                      />
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => seteditisopen(!editisopen)}>
                        {!editisopen ? (
                          <Text>Select start time</Text>
                        ) : (
                          <Text>close start time selector</Text>
                        )}
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
                      ) : (
                        <Text>
                          {selecthour}:{selectminute}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => seteditendisopen(!editendisopen)}>
                        {editendisopen ? (
                          <Text>Select end time</Text>
                        ) : (
                          <Text>close end time selector</Text>
                        )}
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
                      ) : (
                        <Text>
                          {selectendhour}:{selectendminute}
                        </Text>
                      )}
                      <View style={{flexDirection: 'row'}}>
                        <Button
                          title="edit"
                          onPress={() => {
                            edittime();
                            setEditModalVisible(!editModalVisible);
                          }}
                        />
                        <Button
                          title="cancel"
                          onPress={() => {
                            setEditModalVisible(!editModalVisible);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
            {/* end add form */}
            {timeid !== '' && mode === 'delete' ? (
              <View>
                {Alert.alert(
                  'Remove time?',
                  'Are you sure you want to remove this time',
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
                        setmode('');
                        settimeid('');
                      },
                    },
                  ],
                  {cancelable: false},
                )}
              </View>
            ) : null}
            {schedulemode === 'user' ? (
              <TouchableOpacity
                style={styles.opacitybutton}
                onPress={() => toggleschedulemode()}>
                <Text style={{fontSize: 20}}>
                  Integrate Schedule With Group
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.opacitybutton}
                onPress={() => toggleschedulemode()}>
                <Text style={{fontSize: 20}}>Show Personal Schedule</Text>
              </TouchableOpacity>
            )}
            <View style={styles.button}>
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  marginRight: 10,
                  alignItems: 'center',
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
            </View>
            <View style={{marginBottom: -20}} />
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
                          {schedulemode === 'user' ? (
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
                                  setEditModalVisible(!editModalVisible);
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
                          ) : null}
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
            <View>
              <TouchableOpacity onPress={() => setismonday(!ismonday)}>
                <Text style={{fontSize: 30, textAlign: 'center'}}>Monday</Text>
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
                        {schedulemode === 'user' ? (
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
                                setEditModalVisible(!editModalVisible);
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
                        ) : null}
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
                <Text style={{fontSize: 30, textAlign: 'center'}}>Tuesday</Text>
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
                        {schedulemode === 'user' ? (
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
                                setEditModalVisible(!editModalVisible);
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
                        ) : null}
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
              <TouchableOpacity onPress={() => setiswednesday(!iswednesday)}>
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
                        {schedulemode === 'user' ? (
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
                                setEditModalVisible(!editModalVisible);
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
                        ) : null}
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
              <TouchableOpacity onPress={() => setisthursday(!isthursday)}>
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
                        {schedulemode === 'user' ? (
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
                                setEditModalVisible(!editModalVisible);
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
                        ) : null}
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
                <Text style={{fontSize: 30, textAlign: 'center'}}>Friday</Text>
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
                        {schedulemode === 'user' ? (
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
                                setEditModalVisible(!editModalVisible);
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
                        ) : null}
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
              <TouchableOpacity onPress={() => setissaturday(!issaturday)}>
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
                        {schedulemode === 'user' ? (
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
                                setEditModalVisible(!editModalVisible);
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
                        ) : null}
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
        </ScrollView>
      </SafeAreaView>
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
  },
});

export default Home;
