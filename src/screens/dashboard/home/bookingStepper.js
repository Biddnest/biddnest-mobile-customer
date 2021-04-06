import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import {Colors, hp} from '../../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';
import StepIndicator from 'react-native-step-indicator';
import MovingForm from './mySelf/movingForm';
import DateOfMovement from './mySelf/dateOfMovement';
import RequirementDetails from './mySelf/requirementDetails';
import InitialQuote from './mySelf/initialQuote';
import Timer from './mySelf/timer';
import LocationDistance from '../../../components/locationDistance';
import FriendsDetails from './mySelf/friendsDetails';
import Feather from 'react-native-vector-icons/Feather';
import ActivePinMap from '../../../assets/svg/active_pin_map.svg';
import FinishMapPin from '../../../assets/svg/finish_map_pin.svg';
import InActiveCalender from '../../../assets/svg/inactive_calender.svg';
import ActiveCalender from '../../../assets/svg/active_calender.svg';
import FinishCalender from '../../../assets/svg/finish_calender.svg';
import InActiveBed from '../../../assets/svg/inactive_bed.svg';
import ActiveBed from '../../../assets/svg/active_bed.svg';
import FinishBed from '../../../assets/svg/finish_bed.svg';
import InActiveRs from '../../../assets/svg/inactive_rs.svg';
import ActiveRs from '../../../assets/svg/active_rs.svg';
import ActiveFriends from '../../../assets/svg/active_friends.svg';
import FinishFriends from '../../../assets/svg/finish_friends.svg';
import {CustomAlert, CustomConsole} from '../../../constant/commonFun';
import {useDispatch} from 'react-redux';
import {APICall, getAllInventories} from '../../../redux/actions/user';
import {STORE} from '../../../redux';
import {getDistance} from 'geolib';
import {STYLES} from '../../../constant/commonStyle';

const BookingStepper = (props) => {
  const dispatch = useDispatch();
  const [currentPosition, setCurrentPosition] = useState(0);
  const bookingFor = props?.route?.params?.bookingFor || 'Myself';
  const movementType = props?.route?.params?.movementType || {};
  const [headerText, setHeaderText] = useState(
    bookingFor === 'Myself' ? 'MOVING TO' : '',
  );
  const [movingFrom, setMovingFrom] = useState(false);
  const [data, setData] = useState({
    booking_id: null,
    service_id: movementType?.id,
    source: {
      lat: 21.1702,
      lng: 72.8311,
      meta: {
        geocode: '',
        floor: 0,
        address: '',
        city: '',
        state: '',
        pincode: '',
        lift: 0,
        shared_service: true,
      },
    },
    destination: {
      lat: 21.1702,
      lng: 72.8311,
      meta: {
        geocode: '',
        floor: 0,
        address: '',
        city: '',
        state: '',
        pincode: '',
        lift: 1,
        shared_service: false,
      },
    },
    contact_details: {
      name: '',
      phone: '',
      email: '',
    },
    meta: {
      self_booking: bookingFor === 'Myself',
      subcategory: null,
      customer: {
        remarks: '',
      },
      images: [],
    },
    movement_dates: [],
    inventory_items: [],
  });
  const [apiResponse, setApiResponse] = useState({});

  useEffect(() => {
    dispatch(getAllInventories());
  }, []);
  useEffect(() => {
    switch (currentPosition) {
      case 0:
        if (bookingFor === 'Others') {
          setHeaderText("FRIEND'S DETAILS");
        } else {
          setHeaderText(movingFrom ? 'MOVING TO' : 'MOVING FROM');
        }
        break;
      case 1:
        if (bookingFor === 'Others') {
          setHeaderText(movingFrom ? 'MOVING TO' : 'MOVING FROM');
        } else {
          setHeaderText('DATE OF MOVEMENT');
        }
        break;
      case 2:
        if (bookingFor === 'Others') {
          setHeaderText('DATE OF MOVEMENT');
        } else {
          setHeaderText('REQUIREMENT DETAILS');
        }
        break;
      case 3:
        if (bookingFor === 'Others') {
          setHeaderText('REQUIREMENT DETAILS');
        } else {
          if (apiResponse?.bid_result_at !== null) {
            setHeaderText('TIMER');
          } else {
            setHeaderText('INITIAL QUOTE');
          }
        }
        break;
      case 4:
        if (bookingFor === 'Others') {
          if (apiResponse?.bid_result_at !== null) {
            setHeaderText('TIMER');
          } else {
            setHeaderText('INITIAL QUOTE');
          }
        } else {
          setHeaderText('');
        }
        break;
      default: {
        break;
      }
    }
  }, [currentPosition, apiResponse, movingFrom]);

  const onPageChange = (position) => {
    // if (currentPosition > position) {
    setCurrentPosition(position);
    // }
  };

  const renderFriends = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveFriends width={hp(9)} height={hp(9)} />;
    } else if (stepStatus === 'finished') {
      return <FinishFriends width={hp(9)} height={hp(9)} />;
    } else {
      return null;
    }
  };
  const renderMapPin = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActivePinMap width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return <FinishMapPin width={hp(3.5)} height={hp(3.5)} />;
    } else {
      return <Feather name={'map-pin'} size={25} color={'#9597B1'} />;
    }
  };
  const renderCalender = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveCalender width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return <FinishCalender width={hp(3.5)} height={hp(3.5)} />;
    } else {
      return <InActiveCalender width={hp(3.5)} height={hp(3.5)} />;
    }
  };
  const renderBed = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveBed width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return <FinishBed width={hp(3.5)} height={hp(3.5)} />;
    } else {
      return <InActiveBed width={hp(3.5)} height={hp(3.5)} />;
    }
  };
  const renderRS = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveRs width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return null;
    } else {
      return <InActiveRs width={hp(3.5)} height={hp(3.5)} />;
    }
  };
  const getStepIndicatorIconConfig = ({
    position,
    stepStatus,
  }: {
    position: number,
    stepStatus: string,
  }) => {
    switch (position) {
      case 0:
        if (bookingFor === 'Others') {
          return renderFriends(stepStatus);
        }
        return renderMapPin(stepStatus);
      case 1:
        if (bookingFor === 'Others') {
          return renderMapPin(stepStatus);
        }
        return renderCalender(stepStatus);
      case 2:
        if (bookingFor === 'Others') {
          return renderCalender(stepStatus);
        }
        return renderBed(stepStatus);
      case 3:
        if (bookingFor === 'Others') {
          return renderBed(stepStatus);
        }
        return renderRS(stepStatus);
      case 4:
        if (bookingFor === 'Others') {
          return renderRS(stepStatus);
        }
        return null;
      default: {
        break;
      }
    }
  };
  const handleStateChange = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };
  const handleBooking = (service_type) => {
    //Accept order
    let obj = {
      url: 'bookings/confirm',
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
      data: {
        service_type: service_type,
        public_booking_id: apiResponse?.public_booking_id,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          setApiResponse(res?.data?.data?.booking);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  };
  const renderStepIndicator = (params: any) =>
    getStepIndicatorIconConfig(params);

  const renderComponent = () => {
    switch (currentPosition) {
      case 0:
        if (headerText !== 'MOVING TO') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <FriendsDetails
              data={data}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <MovingForm
            data={data}
            handleStateChange={handleStateChange}
            movingFrom={movingFrom}
            changeTo={() => setMovingFrom(true)}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 1:
        if (headerText !== 'DATE OF MOVEMENT') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <MovingForm
              data={data}
              handleStateChange={handleStateChange}
              movingFrom={movingFrom}
              changeTo={() => setMovingFrom(true)}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <DateOfMovement
            data={data}
            handleStateChange={handleStateChange}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 2:
        if (headerText !== 'REQUIREMENT DETAILS') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <DateOfMovement
              data={data}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <RequirementDetails
            data={data}
            apiResponse={apiResponse}
            setApiResponse={setApiResponse}
            handleStateChange={handleStateChange}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 3:
        if (headerText !== 'Initial Quote') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <RequirementDetails
              data={data}
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        if (apiResponse?.bid_result_at !== null) {
          return (
            <Timer
              data={data}
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <InitialQuote
            data={data}
            apiResponse={apiResponse}
            setApiResponse={setApiResponse}
            handleStateChange={handleStateChange}
            handleBooking={handleBooking}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 4:
        if (apiResponse?.bid_result_at !== null) {
          return (
            <Timer
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
              data={data}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <InitialQuote
            apiResponse={apiResponse}
            setApiResponse={setApiResponse}
            data={data}
            handleStateChange={handleStateChange}
            handleBooking={handleBooking}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.pageBG}}>
      <SimpleHeader
        headerText={headerText}
        navigation={props.navigation}
        onBack={() => {
          if (headerText === 'MOVING TO') {
            setMovingFrom(false);
          } else {
            if (currentPosition > 0) {
              setCurrentPosition(currentPosition - 1);
            } else {
              props.navigation.goBack();
            }
          }
        }}
      />
      <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
        {((bookingFor === 'Others' && currentPosition > 1) ||
          (bookingFor === 'Myself' && currentPosition > 0)) && (
          <LocationDistance
            onEditClick={() => setCurrentPosition(0)}
            from={
              data?.source?.meta?.city === data?.destination?.meta?.city
                ? data?.source?.meta?.address
                : data?.source?.meta?.city
            }
            to={
              data?.source?.meta?.city === data?.destination?.meta?.city
                ? data?.destination?.meta?.address
                : data?.destination?.meta?.city
            }
            distance={{
              source: {
                lat: data?.source?.lat,
                lng: data?.source?.lng,
              },
              destination: {
                lat: data?.destination?.lat,
                lng: data?.destination?.lng,
              },
            }}
          />
        )}
        <View style={{paddingVertical: hp(2)}}>
          <StepIndicator
            stepCount={bookingFor === 'Myself' ? 4 : 5}
            customStyles={STYLES.stepperStyle}
            currentPosition={currentPosition}
            renderStepIndicator={renderStepIndicator}
          />
        </View>
        {renderComponent()}
      </LinearGradient>
    </View>
  );
};

export default BookingStepper;
