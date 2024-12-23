function myFunction() {
  
}
var CALENDAR_ID = 'c_3422e23e77393c4ab6e8241310c59452328bc68bcbb0f6c314e53cdbfa508378@group.calendar.google.com'; 
function addReservation(reservation) {
  try {
    // 로그 시작
    console.log('addReservation 호출됨');
    console.log('예약 정보:', reservation);

    // 예약 가능 요일 및 시간대 설정
    var allowedDays = {
      2: { start: '17:00', end: '23:00' }, // 화요일
      5: { start: '17:00', end: '23:00' }, // 금요일
      0: { start: '10:00', end: '17:00' }  // 일요일
    };

    var date = new Date(reservation.date);
    var day = date.getDay();
    console.log('예약 요일:', day);

    if (!(day in allowedDays)) {
      return '예약은 화요일, 금요일, 일요일에만 가능합니다.';
    }

    var timeZone = 'Asia/Seoul';

    // 예약 시간 생성
    var startDateTime = new Date(reservation.date + 'T' + reservation.startTime + ':00');
    var endDateTime = new Date(reservation.date + 'T' + reservation.endTime + ':00');
    console.log('시작 시간:', startDateTime);
    console.log('종료 시간:', endDateTime);

    // 예약 가능 시간대 가져오기
    var allowedStartTime = new Date(reservation.date + 'T' + allowedDays[day].start + ':00');
    var allowedEndTime = new Date(reservation.date + 'T' + allowedDays[day].end + ':00');
    console.log('예약 가능 시작 시간:', allowedStartTime);
    console.log('예약 가능 종료 시간:', allowedEndTime);

    // 예약 시간 유효성 검사
    if (startDateTime < allowedStartTime || endDateTime > allowedEndTime) {
      return '예약 가능 시간대가 아닙니다.';
    }

    if (startDateTime >= endDateTime) {
      return '시작 시간은 종료 시간보다 이전이어야 합니다.';
    }

    // 이벤트 생성
    var event = {
      summary: reservation.name,
      description: reservation.details || '',
      start: {
        dateTime: Utilities.formatDate(startDateTime, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        timeZone: timeZone
      },
      end: {
        dateTime: Utilities.formatDate(endDateTime, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        timeZone: timeZone
      }
    };

    console.log('이벤트 생성:', event);

    Calendar.Events.insert(event, CALENDAR_ID);
    console.log('이벤트 삽입 완료');

    return '예약이 성공적으로 추가되었습니다.';
  } catch (e) {
    console.error('오류 발생:', e);
    throw e;
  }
}

function getReservations() {
  var events = Calendar.Events.list(CALENDAR_ID, {
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime'
  }).items;

  if (!events) {
    return [];
  }

  return events.map(function(event) {
    return {
      id: event.id,
      name: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date
    };
  });
}


function deleteReservation(eventId) {
  try {
    Calendar.Events.remove(CALENDAR_ID, eventId);
    return '예약이 성공적으로 삭제되었습니다.';
  } catch (e) {
    return '예약을 삭제하는 데 오류가 발생했습니다.';
  }
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
          .setTitle('예약 시스템');
}
