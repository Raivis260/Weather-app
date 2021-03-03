export default function formatDate(timestamp) {
  const date = new Date(timestamp);

  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let day = date.getDate();

  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  const convertedDate = `${year}/ ${month}/ ${day}`;

  return convertedDate;
}
