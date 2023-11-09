module.exports = {
  // 문자열은 홀따옴표(')로 formatting
  singleQuote: true,
  //코드 마지막에 세미콜른이 있게 formatting
  semi: true,
  //탭의 사용을 금하고 스페이스바 사용으로 대체하게 formatting
  useTabs: false,
  // 들여쓰기 너비는 2칸
  tabWidth: 2,
  // 객체나 배열을 작성 할 때, 원소 혹은 key-value의 맨 뒤에 있는 것에도 쉼표를 붙임
  trailingCommas: 'all',
  // 코드 한줄이 maximum 80칸
  printWidth: 90,
  // 화살표 함수가 하나의 매개변수를 받을 때 괄호를 생략하게 formatting
  arrowParens: 'always',
  // 개체 리터럴에서 대괄호 사이에 공백을 인쇄합니다.
  bracketSpacing: true,
  // >를 다음 줄에 표시
  bracketLine: false,
  endOfLine: 'auto', // 이 부분 추가
};
