export const FormateDate = rawDate => {
    let date11 = new Date(rawDate);
    console.log(date11)
    let year = date11.getFullYear();
    let month = date11.getMonth() + 1;
    let day = date11.getDate();
    // console.log(month)
    console.log(day)

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };