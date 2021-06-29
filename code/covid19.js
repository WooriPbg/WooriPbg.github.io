var fields = [
  {
    fieldName: 'centerName',
    dataType: 'text',
  },
  {
    fieldName: 'sido',
    dataType: 'text',
  },
  {
    fieldName: 'sigungu',
    dataType: 'text',
  },
  {
    fieldName: 'facilityName',
    dataType: 'text',
  },
  {
    fieldName: 'zipCode',
    dataType: 'number',
  },
  {
    fieldName: 'address',
    dataType: 'text',
  },
  {
    fieldName: 'centerType',
    dataType: 'text',
  },
  {
    fieldName: 'org',
    dataType: 'text',
  },
];
var columns = [
  {
    Name: 'centerName',
    fieldName: 'centerName',
    Type: 'text',
    width: '100',
    header: {
      text: '예방접종센터명',
    },
  },
  {
    Name: 'sido',
    fieldName: 'sido',
    Type: 'text',
    width: '80',
    header: {
      text: '시도',
    },
  },
  {
    Name: 'sigungu',
    fieldName: 'sigungu',
    Type: 'text',
    width: '100',
    header: {
      text: '시군구',
    },
  },
  {
    Name: 'facilityName',
    fieldName: 'facilityName',
    dataType: 'text',
    width: '200',
    header: {
      text: '시설명',
    },
  },
  {
    Name: 'zipCode',
    fieldName: 'zipCode',
    Type: 'number',
    width: '70',
    numberFormat: '#,###',
    header: {
      text: '우편번호',
    },
  },
  {
    Name: 'address',
    fieldName: 'address',
    Type: 'text',
    width: '200',
    header: {
      text: '주소',
    },
  },
  {
    Name: 'centerType',
    fieldName: 'centerType',
    Type: 'text',
    width: '140',
    header: {
      text: '예방접종센터 유형',
    },
  },
  {
    Name: 'org',
    fieldName: 'org',
    Type: 'text',
    width: '130',
    header: {
      text: '운영기관',
    },
  },
];
//api 공공데이터 불러오기
const url =
  'https://api.odcloud.kr/api/15077586/v1/centers?page=1&perPage=300&serviceKey=pZjwKeoX1NDIlfVbHNIEnUEsN5Zv%2BSqsx%2BW5LZcMNm7lOnXny79i%2BnRALMYe0AaXHpIk0x1uHkmuQik9QRuxOw%3D%3D';

fetch(url)
  .then((res) => res.json())
  .then((myJson) => {
    dataProvider.setRows(myJson.data);
    setTimeout(autoWidth, 100);
    //데이터의 마지막 업데이트 시간 표시
    document.getElementById('time').innerText = dataUpdateTime();
    // 총 검색된 데이터의 갯수 표시
    document.getElementById('page').innerText =
      '총' + JSON.stringify(myJson.data.length) + '개의  센터가 검색됨';
  });
var dataProvider, gridContainer, gridView;

function createGrid(container) {
  dataProvider = new RealGrid.LocalDataProvider();
  gridView = new RealGrid.GridView(container);
  gridView.setDataSource(dataProvider);

  dataProvider.setFields(fields);
  gridView.setColumns(columns);

  gridView.displayOptions.emptyMessage = '표시할 데이타가 없습니다.';
  gridView.header.height = 40;
  gridView.displayOptions.rowHeight = 36;
  gridView.footer.height = 40;
  gridView.stateBar.width = 0;

  //그리드를 읽기 전용 상태로 설정
  gridView.setEditOptions({ editable: false });
  gridView.setCopyOptions({ enabled: false });
}

function start() {
  createGrid('realgrid');
}
window.onload = start;

//열 고정
function columnfiexd() {
  var checkBox = document.getElementById('fixed');
  if (checkBox.checked === true) {
    gridView.setFixedOptions({
      colCount: 1,
    });
  } else {
    gridView.setFixedOptions({
      colCount: 0,
    });
  }
}
//시/도 자동 필터
function sidoFilter() {
  var checkBox = document.getElementById('sido');
  if (checkBox.checked === true) {
    gridView.setColumnProperty('sido', 'autoFilter', true);
  } else {
    gridView.setColumnProperty('sido', 'autoFilter', false);
  }
}
//예방접종센터 유형 자동필터
function centerFilter() {
  var checkBox = document.getElementById('centerType');
  if (checkBox.checked === true) {
    gridView.setColumnProperty('centerType', 'autoFilter', true);
  } else {
    gridView.setColumnProperty('centerType', 'autoFilter', false);
  }
}
//셀 클릭시 행 선택
function SelectRows() {
  var checkBox = document.getElementById('rows');
  if (checkBox.checked === true) {
    gridView.displayOptions.selectionStyle = 'rows';
  } else {
    gridView.displayOptions.selectionStyle = 'block';
  }
}
//컨텐츠의 너비 만큼 자동으로 컬럼의 너비 조정
function autoWidth() {
  var columns = dataProvider.getOrgFieldNames();
  for (var i = 0; i < columns.length; i++) {
    gridView.fitLayoutWidth(columns[i], 350, 30);
  }
}
//검색 기능 구현(시군구 내부에서만 검색하도록 설정)
function gridSearch() {
  var checkBox = document.getElementById('search');
  var value = document.getElementById('textSearch').value;
  var fields = dataProvider.getOrgFieldNames();
  var startFieldIndex = fields.indexOf(gridView.getCurrent().fieldName) + 1;
  var options = {
    fields: 'sigungu',
    value: value,
    startIndex: gridView.getCurrent().itemIndex,
    startFieldIndex: startFieldIndex,
    wrap: true,
    select: true,
    caseSensitive: false,
    partialMatch: true, //부분일치 검색 허용
  };
  //검색 강조 기능
  if (value != '') {
    if (checkBox.checked === true) {
      gridView.setCellStyleCallback(function (grid, dataCell) {
        var ret = {};
        var search = String(dataCell.value).indexOf(value);
        if (search >= 0) {
          if (dataCell.dataColumn.name === 'sigungu') {
            ret.styleName = 'search-emphasize';
          }
        }
        return ret;
      });
    } else {
      resetStyle();
    }
    var index = gridView.searchCell(options);
    gridView.setCurrent(index);
  }
}
//검색 초기화 기능
function searchReset() {
  gridView.resetCurrent();
  gridView.clearCurrent();
  resetStyle();
}
//시군구 컬럼 스타일 초기화
function resetStyle() {
  gridView.setCellStyleCallback(function (grid, dataCell) {
    var ret = {};
    if (dataCell.dataColumn.name === 'sigungu') {
      ret.styleName = 'search-normal';
    }
    return ret;
  });
}
//선택된 행이 있을시 선택된 행만 Export하고 선택된 행이 없을시 모든 행을 Export 한다.
function excelExport() {
  var checked = gridView.getCheckedItems();
  if (!checked.length) {
    gridView.exportGrid({
      type: 'excel',
      target: 'local',
      applyFitStyle: true,
      footer: 'hidden',
      onlyCheckedItems: false,
    });
  } else {
    gridView.exportGrid({
      type: 'excel',
      target: 'local',
      applyFitStyle: true,
      footer: 'hidden',
      onlyCheckedItems: true,
    });
  }
}
//컨텍스트 메뉴 on/off
function btnContextMenu() {
  var checkBox = document.getElementById('hide');
  if (checkBox.checked) {
    var contextMenu = [
      {
        label: '컬럼 모두 보이기',
        tag: 'visibleTrue',
      },
      {
        label: '컬럼 숨기기',
        tag: 'visibleFalse',
      },
    ];
    gridView.setContextMenu(contextMenu);
    gridView.onContextMenuPopup = function (grid, x, y, elementName) {
      if (elementName.cellType === 'header') {
        return true;
      } else {
        return false;
      }
    };
  } else {
    gridView.onContextMenuPopup = function (grid, x, y, elementName) {
      return false;
    };
  }
  setContextMenuClicked(gridView);
}
//컨텍스트 메뉴 실행시 발생하는 이벤트
function setContextMenuClicked(gridView) {
  gridView.onContextMenuItemClicked = function (gridView, data, index) {
    if (data.tag === 'visibleTrue') {
      var columns = gridView.getColumns();
      for (var i in columns) {
        gridView.setColumnProperty(columns[i].name, 'visible', true);
      }
    } else if (data.tag === 'visibleFalse') {
      gridView.setColumnProperty(index.column, 'visible', false);
    }
  };
}
//현재 시간을 반환 해주는 함수
function dataUpdateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var time = now.getHours();
  var minutes = now.getMinutes();
  if (12 <= time) {
    if (13 <= time) {
      time = '오후 ' + (time - 12);
    }
    time = '오후 ' + time;
  } else {
    time = '오전 ' + time;
  }
  var updateTime =
    year +
    '년 ' +
    month +
    '월 ' +
    date +
    '일 ' +
    time +
    '시 ' +
    minutes +
    '분 기준';
  return updateTime;
}
// 체크 되어있는 라디오의 값을 반환해주는 함수
function radioCheck() {
  var chk = document.getElementsByName('chk');
  for (var i = 0; i < chk.length; i++) {
    if (chk[i].checked) {
      return chk[i].value;
    }
  }
}
// 모든 컨트롤 창을 닫는 함수
function radioOff() {
  var control = document.querySelectorAll('.radio');
  for (var i = 0; i < control.length; i++) {
    control[i].classList.remove('active');
  }
}
// 체크 되어있는 라디오에 해당하는 컨트롤 창을 나타내주는 함수
function radioOn(radio) {
  var radioInfo;
  radioInfo = document.getElementById(radio);
  radioInfo.classList.add('active');
}

// 컨트롤 (열기/닫기)버튼 눌렀을때  실행되는 함수
function controlClose() {
  var value = document.getElementById('close');
  var text = document.getElementById('close').innerText;
  var onRadio = radioCheck();

  if (text === '컨트롤 열기') {
    document.getElementById('title').classList.add('active');
    document.getElementById(onRadio).classList.add('active');
    value.innerText = '컨트롤 닫기';
  } else if (text === '컨트롤 닫기') {
    radioOff();
    value.innerText = '컨트롤 열기';
  }
}
//라디오 버튼 클릭 되었을때 실행되는 함수
function ClickRadio() {
  var text = document.getElementById('close').innerText;
  var onRadio;
  if (text === '컨트롤 열기') {
    return;
  } else if (text === '컨트롤 닫기') {
    onRadio = radioCheck();
    if (onRadio === 'grid') {
      radioOff();
      radioOn(onRadio);
    } else if (onRadio === 'data') {
      radioOff();
      radioOn(onRadio);
    } else if (onRadio === 'app') {
      radioOff();
      radioOn(onRadio);
    }
  }
}
